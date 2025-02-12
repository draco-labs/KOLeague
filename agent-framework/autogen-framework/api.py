import os
import re
import asyncio
import requests
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, date
import motor.motor_asyncio

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from llama_cpp_agent import LlamaCppAgent, MessagesFormatterType
from llama_cpp_agent.providers import LlamaCppPythonProvider

from llama_model import LlamaModel
import json

from enum import Enum

from fastapi import FastAPI, Body, HTTPException
from pydantic import BaseModel
import re
from typing import Optional
import pandas as pd

from rapidfuzz import fuzz
from fastapi.middleware.cors import CORSMiddleware

import textwrap
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor
from pymongo import MongoClient
import redis
from autogen import ConversableAgent, GroupChat, GroupChatManager
import google.generativeai as genai

app = FastAPI()

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
generation_config = {
    "temperature": 0,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
]
genai.configure(api_key=GOOGLE_API_KEY)

gemini_model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-thinking-exp",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable not set")

CONFIG_LIST = [{"model": "gpt-4o", "api_key": OPENAI_API_KEY}]

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

session = requests.Session()

redis_host = os.getenv("REDIS_HOST", "localhost")
redis_password = os.getenv("REDIS_PASSWORD", None)
redis_port = int(os.getenv("REDIS_PORT", 6379))
redis_cache = redis.StrictRedis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True)


@lru_cache(maxsize=1)
def get_top_10_screen_names():
    url = os.getenv("KOL_API_URL")
    if not url:
        print("KOL_API_URL is not set in the environment variables.")
        return []

    headers = {
        "accept": "text/plain",
        "Content-Type": "application/json"
    }
    payload = {
        "screenName": "",
        "limit": 10,
        "sort": 0,
        "lpRankID": ""
    }
    
    try:
        session = requests.Session()
        response = session.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if "data" in data and isinstance(data["data"], list):
            return [entry["screenName"] for entry in data["data"][:10]]
        else:
            print("Invalid response format in get_top_10_screen_names")
            return []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching top KOLs: {e}")
        return []

def get_recent_tweets_about_coin(coin_name: str, start_date: datetime, end_date: datetime) -> dict:
    top_kols = get_top_10_screen_names()
    if not top_kols:
        print("Can't get top KOL, stop tweet query.")
        return {}

    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]

    query = {
        "detected_coins": {"$regex": f".*{coin_name}.*", "$options": "i"},
        "created_record_at": {"$gte": start_date, "$lte": end_date},
        "type": 1,
        "lang": "en",
        "screen_name": {"$in": top_kols},
        "action_prompt": {"$in": ["buy", "sell"]},
        "term_classification": "short-term", 
    }

    projection = {
        "_id": 0,
        "id": 1,
        "type": 1,
        "action_prompt": 1,
        "create_at_text": 1,
        "create_at": 1,
        "detected_coins": 1,
        "full_text": 1,
        "lang": 1,
        "post_url": 1,
        "screen_name": 1,
        "sentiment_prompt": 1,
        "term_classification": 1,
        "user_id": 1,
    }

    tweets_cursor = collection.find(query, projection).sort("created_record_at", -1)

    buy_tweets = []
    sell_tweets = []
    for tweet in tweets_cursor:
        if tweet.get("action_prompt") == "buy" and len(buy_tweets) < 5:
            buy_tweets.append(tweet)
        elif tweet.get("action_prompt") == "sell" and len(sell_tweets) < 5:
            sell_tweets.append(tweet)
        if len(buy_tweets) >= 5 and len(sell_tweets) >= 5:
            break

    return {"buy_tweets": buy_tweets, "sell_tweets": sell_tweets}

def get_binance_price_history(coin_symbol: str, start_date: datetime, end_date: datetime) -> dict:
    url = os.getenv("BINANCE_PRICE_HISTORY_URL")
    if not url:
        print("BINANCE_PRICE_HISTORY_URL is not set in the environment variables.")
        return None

    payload = {
        "symbol": coin_symbol,
        "exchange": "binance",
        "from": int(start_date.timestamp() * 1000),
        "to": int(end_date.timestamp() * 1000),
        "limit": 200,
        "interval": "4h",
    }
    headers = {
        "accept": "application/json", 
        "Content-Type": "application/json"
    }

    try:
        session = requests.Session()
        response = session.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching price history: {e}")
        return None

def format_tweets(tweets):
    return "\n\n".join(
        f"- Tweet by @{tweet['screen_name']} at {tweet['create_at_text']}:\n  Link: {tweet['post_url']}\n  Content: {tweet['full_text']}"
        for tweet in tweets
    )

def extract_coin_name(text: str) -> str:
    text = text.lower().strip()
    triggers = [
        "let's talk about",
        "buy",
        "sell",
        "hold",
        "btc",
        "trade",
        "action on",
        "move on",
        "decision on",
        "about"
    ]
    for trigger in triggers:
        if text.startswith(trigger):
            remainder = text[len(trigger):].strip()
            if remainder.startswith('+'):
                remainder = remainder[1:].strip()
            for kw in ["now", "today", "or sell"]:
                if remainder.endswith(kw):
                    remainder = remainder[:-len(kw)].strip()
            if remainder:
                return remainder.split()[0]
    if "investment advice" in text:
        coin_candidate = text.split("investment advice")[0].strip()
        if coin_candidate:
            return coin_candidate.split()[0]
    return None


class ModelChoice(str, Enum):
    GEMINI = "gemini"
    OPENAI = "openai"

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.DEBUG,
    datefmt='%Y-%m-%d %H:%M:%S')

class Item(BaseModel):
    content: str


app = FastAPI(title="Chatbot koleague API")

allow_origins=["*"]

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get(path="/health", tags=["Health Check"])
async def health():
    return {"status": "ok"}

def is_similar(user_text, keywords):
    return any(kw in user_text for kw in keywords)

swap_pattern = re.compile(
    r"(?:swap|swapped|exchange|trade)\s+"
    r"(?P<amount>\d+(?:\.\d+)?)(?:\s+(?P<token_in>[a-zA-Z0-9]+)\s+(?:for|to)\s+(?P<token_out>[a-zA-Z0-9]+))?",
    re.IGNORECASE
)

transfer_pattern = re.compile(
    r"(?:transfer|send)\s+"
    r"(?P<amount>\d+(?:\.\d+)?)?\s*"
    r"(?P<token_in>[a-zA-Z0-9]+)?\s*(?:to\s+)?"
    r"(?P<address>0x[a-fA-F0-9]{40})?",
    re.IGNORECASE
)

class UserRequest(BaseModel):
    user_input: str
    token_in: str = "string"
    token_out: str = "string"
    amount: float = 0.0
    address: str = ""

@app.post("/agent-process")
def agent_process(request: UserRequest):
    user_text = request.user_input.strip().lower()

    if is_similar(user_text, ["rank kol", "ranking kol", "kol rank", "top kol"]):
        url =  os.getenv("KOL_API_URL")
        payload = {
            "screenName": "",
            "limit": 20,
            "sort": 0,
            "lpRankID": ""
        }
        headers = {
            "accept": "text/plain",
            "Content-Type": "application/json"
        }
        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            top_data = data.get("data", [])
            top_20 = [
                {
                    "screenName": item.get("screenName", ""),
                    "profileUrl": item.get("profileUrl", "")
                }
                for item in top_data[:10]
            ]
            return {"top_kol": top_20}
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=str(e))

    if is_similar(user_text, ["top coin", "top coins", "coin top"]):
        url =  os.getenv("COIN_API_URL")
        headers = {"accept": "application/json"}
        excluded_coins = ["COIN", "AI", "ATH", "NFT"]

        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            top_10_coins = [
                coin["coin"]
                for coin in data.get("top_coins", [])[:10]
                if coin["coin"] not in excluded_coins
            ]
            return {"top_10_coins": top_10_coins}
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=str(e))

    if ("top pairs" in user_text and 
       ("swap" in user_text or "swapped" in user_text)):
        url = os.getenv("VOL_TOKEN_API_URL")
        headers = {"accept": "application/json"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            top_vol = data.get("top_tokens", [])

            top_5_vol = [
                {
                    "pair": txn.get("pair", "Unknown"),
                    "vol_24h": txn.get("vol_24h", "0")
                }
                for txn in top_vol[:5]
            ]

            return {"top_transactions": top_5_vol}
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch top transaction tokens: {str(e)}")
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"Invalid response format: {str(e)}")

    if is_similar(user_text, ["top vol", "top volume"]):
        url = os.getenv("VOL_TOKEN_API_URL")
        headers = {"accept": "application/json"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()

            data = response.json()
            top_vol = data.get("top_tokens", [])

            top_5_vol = [
                {
                    "pair": txn.get("pair", "Unknown"),
                    "vol_24h": txn.get("vol_24h", "0")
                }
                for txn in top_vol[:5]
            ]

            return {"top_transactions": top_5_vol}
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch top transaction tokens: {str(e)}")
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"Invalid response format: {str(e)}")

    if is_similar(user_text, ["swap", "swapped", "exchange", "trade"]):
        match = swap_pattern.search(user_text)

        missing_params = []
        
        matched_amount = match.group("amount") if match else None
        matched_token_in = match.group("token_in") if match else None
        matched_token_out = match.group("token_out") if match else None

        token_in_val = matched_token_in or (
            request.token_in if request.token_in.lower() != "string" else None
        )
        if not token_in_val:
            missing_params.append("token_in")

        token_out_val = matched_token_out or (
            request.token_out if request.token_out.lower() != "string" else None
        )
        if not token_out_val:
            missing_params.append("token_out")

        amount_val = (
            float(matched_amount)
            if matched_amount
            else (request.amount if request.amount else None)
        )
        if not amount_val:
            missing_params.append("amount")

        if token_in_val and token_out_val and amount_val is not None:
            return {
                "isSwap": True,
                "token_in": token_in_val.upper(),
                "token_out": token_out_val.upper(),
                "amount": amount_val
            }
        else:
            return {
                "isSwap": False,
                "message": f"Missing parameters: {', '.join(missing_params)}",
                "token_in": token_in_val.upper() if token_in_val else "None",
                "token_out": token_out_val.upper() if token_out_val else "None",
                "amount": amount_val if amount_val else None
            }

    if is_similar(user_text, ["top transaction", "top transactions"]):
        url = os.getenv("TXN_TOKEN_API_URL")
        headers = {"accept": "application/json"}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()

            data = response.json()
            top_transactions = data.get("top_tokens", [])

            top_5_transactions = [
                {
                    "pair": txn.get("pair", "Unknown"),
                    "txn_24h": txn.get("txn_24h", "0")
                }
                for txn in top_transactions[:5]
            ]

            return {"top_transactions": top_5_transactions}
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch top transaction tokens: {str(e)}")
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"Invalid response format: {str(e)}")

    if is_similar(user_text, ["transfer", "send"]):
        match_transfer = transfer_pattern.search(user_text)

        matched_amount = match_transfer.group("amount") if match_transfer else None
        matched_token_in = match_transfer.group("token_in") if match_transfer else None
        matched_address = match_transfer.group("address") if match_transfer else None

        missing_params = []

        token_in_val = matched_token_in or (
            request.token_in if request.token_in.lower() != "string" else None
        )
        if not token_in_val:
            missing_params.append("token_in")

        amount_val = (
            float(matched_amount) 
            if matched_amount 
            else (request.amount if request.amount else None)
        )
        if not amount_val:
            missing_params.append("amount")

        address_val = (
            matched_address 
            or (request.address if request.address.lower().startswith("0x") else None)
        )
        if not address_val:
            missing_params.append("address")

        if token_in_val and amount_val and address_val:
            return {
                "isTransfer": True,
                "token_in": token_in_val.upper(),
                "amount": amount_val,
                "address": address_val
            }

        match_simple_amount = re.search(r"transfer\s+([\d.]+)", user_text)
        if match_simple_amount and not matched_token_in:
            amount_val = float(match_simple_amount.group(1))
            return {
                "isTransfer": False,
                "message": "Missing parameters: token_in, address",
                "token_in": "None",
                "amount": amount_val,
                "address": "None"
            }

        match_simple_token = re.search(r"transfer\s+([a-zA-Z]+)", user_text)
        if match_simple_token and not matched_amount:
            token_in_val = match_simple_token.group(1)
            return {
                "isTransfer": False,
                "message": "Missing parameters: amount, address",
                "token_in": token_in_val.upper(),
                "amount": None,
                "address": "None"
            }

        return {
            "isTransfer": False,
            "message": f"Missing parameters: {', '.join(missing_params)}",
            "token_in": token_in_val.upper() if token_in_val else "None",
            "amount": amount_val if amount_val else None,
            "address": address_val if address_val else "None"
        }

    coin_name_extracted = extract_coin_name(user_text)
    if coin_name_extracted:
        coin_name = coin_name_extracted.upper()

        today = datetime.utcnow().date()
        end_date = datetime.combine(today, datetime.max.time())
        start_date_date = today - timedelta(days=7)
        start_date = datetime.combine(start_date_date, datetime.min.time())

        cache_key = f"coin_analysis:{coin_name}_{start_date.isoformat()}_{end_date.isoformat()}"
        cached_result = redis_cache.get(cache_key)
        if cached_result:
            return {
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": end_date.strftime("%Y-%m-%d"),
                "content_debate": json.loads(cached_result),
                "cached": True,
            }

        with ThreadPoolExecutor(max_workers=2) as executor:
            future_tweets = executor.submit(get_recent_tweets_about_coin, coin_name, start_date, end_date)
            future_price = executor.submit(get_binance_price_history, coin_name, start_date, end_date)
            recent_tweets = future_tweets.result()
            price_history = future_price.result()

        if price_history and isinstance(price_history, list) and len(price_history) > 0:
            current_price = price_history[-1].get("close", "N/A")
            historical_prices = [entry.get("close", "N/A") for entry in price_history]
        else:
            current_price = "N/A"
            historical_prices = "N/A"

        num_buy = len(recent_tweets.get("buy_tweets", []))
        num_sell = len(recent_tweets.get("sell_tweets", []))
        period_str = f"from {start_date.strftime('%Y-%m-%d %H:%M:%S')} to {end_date.strftime('%Y-%m-%d %H:%M:%S')}"
        reference_instructions = (
            'End your response with a "Reference" section listing all tweet links used for analysis in the following format:\n'
            "Reference: "
            "[1](https://x.com/link_tweet_01) "
            "[2](https://x.com/link_tweet_02) "
            "... "
            "[n](https://x.com/link_tweet_0n)"
        )

        if num_buy == 0 and num_sell == 0:
            bull_prompt = textwrap.dedent(f"""
                You are bull_perspective.
                There are no recent BUY tweets about {coin_name} in the period {period_str}.
                Based solely on the following price data:
                - Current Price: {current_price}
                - Historical Prices: {historical_prices}
                Provide your bullish perspective in a buzz marketing style, concise tweet style,
                avoiding clichés and conveying exclusive insights.
                {reference_instructions}
            """).strip()

            bear_prompt = textwrap.dedent(f"""
                You are bear_perspective.
                There are no recent SELL tweets about {coin_name} in the period {period_str}.
                Based solely on the following price data:
                - Current Price: {current_price}
                - Historical Prices: {historical_prices}
                Provide your bearish perspective in a buzz marketing style, concise tweet style,
                avoiding clichés and conveying exclusive insights.
                {reference_instructions}
            """).strip()

            bull_rebuttal_prompt = textwrap.dedent(f"""
                You are bull_perspective_rebuttal.
                In the absence of tweet data, respond to the bearish perspective provided by bear_perspective
                based solely on the price data. Provide a compelling counter-argument in a buzz marketing style,
                concise tweet style, avoiding clichés and conveying exclusive insights.
                {reference_instructions}
            """).strip()

            bear_rebuttal_prompt = textwrap.dedent(f"""
                You are bear_perspective_rebuttal.
                In the absence of tweet data, respond to the bullish perspective provided by bull_perspective
                based solely on the price data. Provide a compelling counter-argument in a buzz marketing style,
                concise tweet style, avoiding clichés and conveying exclusive insights.
                {reference_instructions}
            """).strip()

            judge_prompt = textwrap.dedent(f"""
                You are final_conclusion.
                Based on the following data and the conversation among the agents, decide whether to buy or sell {coin_name}.
                Price Data:
                - Current Price: {current_price}
                - Historical Prices: {historical_prices}

                Bullish Analysis: (Provided by bull_perspective and bull_perspective_rebuttal)
                Bearish Analysis: (Provided by bear_perspective and bear_perspective_rebuttal)

                Provide your final decision in a buzz marketing style with a concise tweet-style explanation,
                avoiding clichés and conveying exclusive insights.
                {reference_instructions}
            """).strip()
        else:
            if num_buy > 0:
                bull_prompt = textwrap.dedent(f"""
                    You are bull_perspective.
                    Your task is to analyze the following BUY tweets about {coin_name} in the period {period_str} and provide compelling arguments in favor of buying {coin_name}.
                    For each tweet, include the posting time, tweet link, and the username of the poster.
                    Tweets:
                    {format_tweets(recent_tweets.get('buy_tweets', []))}
    
                    Present your analysis in a buzz marketing style, concise tweet style,
                    avoiding clichés and conveying exclusive insights.
                    {reference_instructions}
                """).strip()
            else:
                bull_prompt = textwrap.dedent(f"""
                    You are bull_perspective.
                    There are no recent BUY tweets about {coin_name} in the period {period_str}.
                    Based solely on the following price data:
                    - Current Price: {current_price}
                    - Historical Prices: {historical_prices}
                    Provide your bullish perspective in a buzz marketing style, concise tweet style,
                    avoiding clichés and conveying exclusive insights.
                    {reference_instructions}
                """).strip()

            if num_sell > 0:
                bear_prompt = textwrap.dedent(f"""
                    You are bear_perspective.
                    Your task is to analyze the following SELL tweets about {coin_name} in the period {period_str} and provide compelling arguments in favor of selling {coin_name}.
                    For each tweet, include the posting time, tweet link, and the username of the poster.
                    Tweets:
                    {format_tweets(recent_tweets.get('sell_tweets', []))}
    
                    Present your analysis in a buzz marketing style, concise tweet style,
                    avoiding clichés and conveying exclusive insights.
                    {reference_instructions}
                """).strip()
            else:
                bear_prompt = textwrap.dedent(f"""
                    You are bear_perspective.
                    There are no recent SELL tweets about {coin_name} in the period {period_str}.
                    Based solely on the following price data:
                    - Current Price: {current_price}
                    - Historical Prices: {historical_prices}
                    Provide your bearish perspective in a buzz marketing style, concise tweet style,
                    avoiding clichés and conveying exclusive insights.
                    {reference_instructions}
                """).strip()

            bull_rebuttal_prompt = textwrap.dedent(f"""
                You are bull_perspective_rebuttal.
                Based on the bearish analysis provided by bear_perspective, present your counter-arguments in support of buying {coin_name}.
                Use the provided SELL tweets if available as well as your insights from the BUY side.
                Present your counter-arguments in a buzz marketing style, concise tweet style,
                avoiding clichés and conveying exclusive insights.
                {reference_instructions}
            """).strip()

            bear_rebuttal_prompt = textwrap.dedent(f"""
                You are bear_perspective_rebuttal.
                Based on the bullish analysis provided by bull_perspective, present your counter-arguments in support of selling {coin_name}.
                Use the provided BUY tweets if available as well as your insights from the SELL side.
                Present your counter-arguments in a buzz marketing style, concise tweet style,
                avoiding clichés and conveying exclusive insights.
                {reference_instructions}
            """).strip()

            judge_prompt = textwrap.dedent(f"""
                You are final_conclusion.
                Based on the following data and the conversation among the agents, decide whether to buy or sell {coin_name}.
                Price Data:
                - Current Price: {current_price}
                - Historical Prices: {historical_prices}
    
                Bullish Analysis: (Provided by bull_perspective and further supported by bull_perspective_rebuttal)
                Bearish Analysis: (Provided by bear_perspective and further supported by bear_perspective_rebuttal)
    
                If only one type of tweet analysis is available, base your decision on that analysis and the price data.
                Please provide a detailed explanation for your final decision.
            """).strip()

        bull_agent = ConversableAgent(
            name="bull_perspective",
            system_message=bull_prompt,
            llm_config={"config_list": CONFIG_LIST},
            human_input_mode="NEVER",
        )

        bear_agent = ConversableAgent(
            name="bear_perspective",
            system_message=bear_prompt,
            llm_config={"config_list": CONFIG_LIST},
            human_input_mode="NEVER",
        )

        bull_agent_rebuttal = ConversableAgent(
            name="bull_perspective_rebuttal",
            system_message=bull_rebuttal_prompt,
            llm_config={"config_list": CONFIG_LIST},
            human_input_mode="NEVER",
        )

        bear_agent_rebuttal = ConversableAgent(
            name="bear_perspective_rebuttal",
            system_message=bear_rebuttal_prompt,
            llm_config={"config_list": CONFIG_LIST},
            human_input_mode="NEVER",
        )

        judge_agent = ConversableAgent(
            name="final_conclusion",
            system_message=judge_prompt,
            llm_config={"config_list": CONFIG_LIST},
            human_input_mode="NEVER",
        )

        agents_list = [bull_agent, bear_agent, bull_agent_rebuttal, bear_agent_rebuttal, judge_agent]
        group_chat = GroupChat(
            agents=agents_list,
            messages=[],
            send_introductions=False,
            speaker_selection_method="round_robin",
            max_round=6,
        )

        group_chat_manager = GroupChatManager(
            groupchat=group_chat,
            llm_config={"config_list": CONFIG_LIST},
        )

        chat_result = judge_agent.initiate_chat(
            group_chat_manager,
            message=f"This debate has the purpose of deciding whether we should buy or sell {coin_name}",
            summary_method="reflection_with_llm",
        )

        unique_number = redis_cache.incr(f"chat_id_counter:{coin_name}")
        generated_chat_id = f"{coin_name}{unique_number:02d}"

        chat_result_data = {
            "chat_id": generated_chat_id,
            "chat_history": chat_result.chat_history,
            "summary": chat_result.summary,
            "cost": chat_result.cost,
            "human_input": chat_result.human_input,
        }

        print(chat_result_data)

        redis_cache.set(cache_key, json.dumps(chat_result_data), ex=86400)

        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        chat_results_collection = db.get_collection("chat_results")
        chat_results_collection.insert_one({
            "chat_id": generated_chat_id,
            "coin": coin_name,
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
            "chat_result": chat_result_data,
            "created_at": datetime.utcnow()
        })

        return {
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
            "content_debate": chat_result_data,
            "cached": False,
        }

    return {"message": "non script"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
