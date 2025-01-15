from datetime import datetime, timedelta
from datetime import datetime, timezone
import requests
import pandas as pd
import time
from tqdm import tqdm
from pymongo import MongoClient
from collections import Counter
import os



def get_coin(symbol,
             limit=1000,
             start_day='2024-12-01',
             end_day='now',
            url='',
            agg_template={'open':'first', 'close': 'last', 'high':'max','low':'min', 'volume': 'sum'}):
    start_day= datetime.strptime(start_day, '%Y-%m-%d')
    print('start_day',start_day)
    start_day = int(start_day.timestamp() * 1000)
    print('start_day ts',start_day)
    if end_day=='now':
        # Get the current date and time
        end_day = datetime.now(timezone.utc)
        print('end_day',end_day)
        # Convert the current datetime object to a timestamp in milliseconds
        end_day = int(end_day.timestamp() * 1000)
        print('end_day ts',end_day)
    else:
        end_day = datetime.strptime(end_day, '%Y-%m-%d').replace(tzinfo=timezone.utc)
        end_day = end_day.astimezone(timezone.utc)
        print('end_day',end_day)
        end_day = int(end_day.timestamp() * 1000)
        print('end_day ts',end_day)

    #symbol = "beamx"  # Example symbol, replace with your variable
   #exchange = "binance"  # Example exchange, replace with your variable
    #start_day = 0  # Example start day, replace with your variable
    #end_day = 0  # Example end day, replace with your variable
    #limit = 200  # Example limit, replace with your variable
    
    # Define the URL and headers
    headers = {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
    }
    
    # Define the data payload
    data = {
        "symbol": symbol,
        "exchange": "binance",
        "from": start_day,
        "to": end_day,
        "limit": 1000,
        "interval":'15m'
    }
    
    # Make the POST request
    response = requests.post(url, headers=headers, json=data)



    data = response.json()
    #print('data',data)
    #print('symbol',symbol)
    # Convert the JSON data to a pandas DataFrame
    df_temp = pd.DataFrame(data)
    if len(data)==0:
        return pd.DataFrame()# return empty dataframe
    # Convert timestamp to datetime and set it as index
    df_temp['timestamp'] = pd.to_datetime(df_temp['timestamp'], unit='ms')
    df_temp.set_index('timestamp', inplace=True)

    #print('raw',df_temp)
    # Resample the data to daily frequency
    print(df_temp.tail(3).to_markdown())

    #df_temp = df_temp.resample('D').agg(agg_template)
    #print(df_temp)
    df_temp=df_temp.sort_values('timestamp')
   
    time.sleep(0.2)
    
    return df_temp.fillna(0)


# Function to generate date ranges
def generate_date_ranges(start_date, end_date, period_weeks):
    date_ranges = []
    current_date = start_date
    while current_date < end_date:
        next_date = current_date + timedelta(days=period_weeks * 7)  # Approximate 1 months
        if next_date > end_date:
            next_date = end_date
        date_ranges.append((current_date, next_date))
        current_date = next_date
    return date_ranges

# Function to get coin data for each date range

def get_coin_data(symbol,
                  start_day,
                  end_day,
                  period_weeks=3,
                  url_set='',
                  agg_template_set={'open':'first', 'close': 'last', 'high':'max','low':'min', 'volume': 'sum'}):
    date_ranges = generate_date_ranges(start_day, end_day, period_weeks)
    df_temps = []
    for start, end in tqdm(date_ranges,desc='getting '+symbol+'...'):
        df_temp = get_coin(symbol,
                           limit=1000,
                           start_day=start.strftime('%Y-%m-%d'),
                           end_day=end.strftime('%Y-%m-%d'),
                           url=url_set,
                           agg_template=agg_template_set)
        df_temps.append(df_temp)
    out_df=pd.concat(df_temps)
    #out_df = out_df.drop_duplicates(subset='timestamp', keep='first')
    #out_df=out_df.set_index('timestamp', inplace=True)
    return out_df


def get_sentimental_data(exclude_list = ["COIN", "AI"],single_coin=True,top=15):
    mongodb_url=''
    client = MongoClient(mongodb_url)
    db = client.graphscope

    collection = db.tweets_analysis_result

    # Retrieve all records from the collection
    all_records = collection.find()

    # Retrieve all records from the collection and convert them to a list
    all_records = list(collection.find())

    # Convert the list of records into a pandas DataFrame
    sdf = pd.DataFrame(all_records)

    sdf=sdf[(sdf['term_classification']=='short-term')]
    #sdf=sdf[sdf['type']==1]
    #print('type 3',len(sdf[(sdf['type']==3)]))
    #print('type 2',len(sdf[(sdf['type']==2)]))
    #print('type 1',len(sdf[(sdf['type']==1)]))

    #sdf=sdf[(sdf['type']==2)]

    #df = df[df['detected_coins'].str.contains('BTC', case=False, na=False)]

    sdf=sdf.drop(['_id'],axis=1)

    print('total',len(sdf))
    #sdf=sdf[['create_at_text','detected_coins','screen_name','action_prompt','post_url']]
    sdf['timestamp']=sdf['create_at_text']
    sdf=sdf.drop('create_at_text',axis=1)
    sdf['timestamp'] = pd.to_datetime(sdf['timestamp'])
    sdf=sdf.sort_values('timestamp')

    # get profile pciture

    query={}
    
    projection = {
        "user_info.screen_name": 1,
        "user_info.name": 1,
        'user_info.profile_url':1 
       #"tags": 1
    }
    
    # Fetch documents from MongoDB that match the query and projection
    print('querrying')
    cursor = db['twitter_user_rank'].find(query, projection)
    
    print('extracting from the query')
    # Create a DataFrame from the cursor
    
    # Create a DataFrame from the cursor
    profile_df = pd.DataFrame(list(tqdm(cursor, desc="Loading data")))
    profile_df['screen_name'] = profile_df[['user_info']].applymap(lambda x: x['screen_name'])
    profile_df['name'] = profile_df[['user_info']].applymap(lambda x: x['name'])
    profile_df['avatar'] = profile_df[['user_info']].applymap(lambda x: x['profile_url'])
    profile_df=profile_df.drop('user_info',axis=1)
    sdf=sdf.merge(profile_df,on='screen_name',how='left')
    #sdf=sdf[(sdf['timestamp']>=pd.to_datetime('2023-01-01'))&(sdf['term_classification']=='short-term')&(sdf['action_prompt']!='hold')] # filter only this year
    
        #ignore list
    
    # Filter out rows where detected_coins is in the exclude list
    sdf = sdf[~sdf['detected_coins'].isin(exclude_list)]

    if single_coin:
        sdf = sdf[~sdf['detected_coins'].str.contains(',', na=False)]

    sdf.to_csv('twitter_data_type_all.csv',index=None)

    # Counting mentions of each coin
    coin_counts = Counter(sdf['detected_coins'])
    
    # Getting the top 10 most mentioned coins
    top_coins = coin_counts.most_common(top)
    
    return top_coins


def get_top_coin():
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {
        'vs_currency': 'usd',         # You can change 'usd' to other currencies like 'eur' or 'btc'
        'order': 'market_cap_desc',   # Orders by market cap descending
        'per_page': 20,               # Get more coins to filter stablecoins
        'page': 1                     # First page of results
    }

    # List of common stablecoin symbols to exclude
    stablecoins = ['usdt', 'usdc', 'busd', 'dai', 'tusd', 'usdp', 'usdd', 'gusd']

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        # Filter out stablecoins by checking if the symbol is in the stablecoins list
        coin_symbols = [coin['symbol'].upper() for coin in data if coin['symbol'].lower() not in stablecoins]
        # Return only the top 10 non-stablecoin symbols
        return coin_symbols[:10]
    else:
        print(f"Error: {response.status_code}")
        return None


def downloading_top_coins(top_10_coin_symbols,debug=False):
    # Make coin folder
    try:
        os.mkdir('coin_data')
    except:
        pass
    
    coin='btc' # Ä‘Ã²ng coin
    
    for coin_info in tqdm(top_10_coin_symbols):
        coin,count=coin_info
        # Example usage
        start_date = datetime(2023, 1, 1) 
        end_date = datetime.now()
        # Get coin df
        #try:
        coin_df = get_coin_data(coin, start_date, end_date, period_weeks=1) # 1000 record 
        coin_df = coin_df[~coin_df.index.duplicated(keep='first')]
        coin_df.to_csv('coin_data/'+coin+'.csv',index=None)
    #except:
        if debug:
            break


def downloading_old_coins(match_df,coin_dict,coin_list):
    # Make coin folder
    if len(match_df)==0:
        return coin_dict,coin_list # nothign change

    make_up_list=match_df['coin'].unique()
    print('making up ',make_up_list)
    
    for coin in tqdm(make_up_list):
        if coin not in coin_list:
        # Example usage
            print('making up coin',coin)
            start_date = datetime(2023, 1, 1) 
            end_date = datetime.now()
            # Get coin df
            #try:
            coin_df = get_coin_data(coin, start_date, end_date, period_weeks=1) # 1000 record 
            coin_df = coin_df[~coin_df.index.duplicated(keep='first')]
            file_path='coin_data/'+coin+'.csv'
            coin_df.to_csv(file_path,index=None)
            
            coin_list.append(coin)
            
            df = pd.read_csv(file_path)  # Read the CSV file
            coin_dict[coin] = df 
            
    return coin_dict,coin_list



