import { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
// import "./App.css";
import path from "path";
import React from "react";
import { useParams } from "next/navigation";
import { useContextStore } from "@/contexts";
import { useAccount } from "@starknet-react/core";
import { DECIMAL, TOKEN_ADDRESS_CONSTANT, formatResponseTokenInOut, provider, swapToken, transfer } from "@/utils/contract/swap";
import { Account, constants } from "starknet";
import axios from "axios";
import TopKOL from "@/components/Chat/TopKOL";
import TopCoin from "@/components/Chat/TopCoin";
import TopToken from "@/components/Chat/TopToken";
import Swap from "@/components/Chat/Swap";
import { getTokenBalance, getTokenDataByTokenAddress } from "@/utils/contract/getBalance";
import Transfer from "@/components/Chat/Transfer";
import TypeWriterText from "@/components/TypeWriterText";
import { HISTORY_CHAT } from "@/constants";

const predefinedResponses = {
    "What's the market sentiment today?": "Today's market sentiment is a dynamic interplay of cautious optimism and strategic foresight. As AI-driven protocols and RWA innovations gain traction, we're witnessing a shift from speculative fervor to tangible utility. The memecoin meta continues to surprise with its resilience, while institutional inflows into DeFi signal a maturing landscape",
    "Which coin is better to hold right now, $ETH or $STRK?": "Ethereum and Starknet each offer unique value propositions in the evolving crypto landscape. Ethereum, with its vast ecosystem and pioneering role in DeFi, serves as a reliable foundation. Starknet, on the other hand, is pushing boundaries with its zk-rollup technology, promising scalability and efficiency. Your choice hinges on whether you prioritize the established security of Ethereum or the innovative potential of Starknet's Layer-2 solutions. Choosing between these two requires deeper understanding, I suggest discussing with our Advisor BOT here to cover this question better!",
    "What is your favorite layer 1 coins?": `I don't have personal preferences or feelings. However, I can provide Top KOL's preferences about popular Layer 1 coins.
- KOL top 1: I like how $SUI is doing, great team, high activity chain
- KOL top 2: Choose $SOL everytime, it's ETH killer this cycle
- KOL top 3: Stay safe, stack sats. $BTC`,
    "What's top KOL's insights on $ETH?": `- KOL top 1: higher it goes
- KOL top 2: ETH remain lower than 3k all this cycle as a concensus trade
- KOL top 3: $ETH is 10k coin, selling now at 3k`
};

export default function Chat() {
    // const { agentId } = useParams();
    const { account } = useAccount();
    const agentId = "ab4677a9-b684-0aba-acc7-c41b8397cc31"
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [tokenIn, setTokenIn] = useState("");
    const [tokenOut, setTokenOut] = useState("");
    const [amount, setAmount] = useState(0);
    const [addressReceipt, setAddressReceipt] = useState("");
    const [topKOL, setTopKOL] = useState(null);
    const [topCoin, setTopCoin] = useState(null);
    const [topToken, setTopToken] = useState(null);
    const [isSwap, setIsSwap] = useState(false);
    const [isTransfer, setIsTransfer] = useState(false);
    const [balance, setBalance] = useState({})
    const [price, setPrice] = useState({})
    const { height } = useContextStore();
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);
    
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (localStorage.getItem(HISTORY_CHAT)) {
            setMessages(JSON.parse(localStorage.getItem(HISTORY_CHAT)))
        }
    }, [])

    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        };
        if (inputRef.current) {
            inputRef.current.focus();
          }
        localStorage.setItem(HISTORY_CHAT, JSON.stringify(messages))
      }, [messages]);
    console.log(height)
    const mutation = useMutation({
        mutationFn: async (text) => {
            const formData = new FormData();
            formData.append("text", text);
            formData.append("userId", "user");
            formData.append("roomId", `default-room-${agentId}`);

            if (selectedFile) {
                formData.append("file", selectedFile);
            }
            try {
                const body = { 
                    user_input: text,
                    token_in: tokenIn,
                    token_out: tokenOut,
                    address: addressReceipt
                 }
                const response = await axios.post(process.env.NEXT_PUBLIC_API_AICHAT + "/agent-process", body)
                if (response?.data?.message !== "non script") {
                    return {
                        bot: true,
                        ...response?.data
                    }
                }
            } catch (error) {
                console.log(error, "error")
            }
            const res = await fetch(`/api/${agentId}/message`, {
                method: "POST",
                body: formData,
            });
            return res.json();
        },
        onSuccess: (data) => {
            if (data.bot) {
                if (data?.top_kol?.length > 0) {
                    const newMessages = [...messages]
                    newMessages.push({
                        user: "dracolab",
                        action: "NONE",
                        // text: "Top KOL",
                        isTopKOL: true,
                        data: data?.top_kol,
                    })
                    setMessages(newMessages);
                    return;
                }
                if (data?.top_10_coins?.length > 0) {
                    const newMessages = [...messages]
                    newMessages.push({
                        user: "dracolab",
                        action: "NONE",
                        // text: "Top KOL",
                        isTopCoin: true,
                        data: data?.top_10_coins,
                    })
                    setMessages(newMessages);
                    return
                }

                if (data?.top_tokens?.length > 0) {
                    const newMessages = [...messages]
                    newMessages.push({
                        user: "dracolab",
                        action: "NONE",
                        // text: "Top KOL",
                        isTopToken: true,
                        data: data?.top_tokens,
                    })
                    setMessages(newMessages);
                    return
                }
                if (data?.isSwap !== undefined) {
                    setTokenIn(formatResponseTokenInOut(data?.token_in))
                    setTokenOut(formatResponseTokenInOut(data?.token_out))
                    setAmount(data?.amount)
                    if (data?.isSwap) {
                        console.log("Show phần swap")
                        const newMessages = [...messages]
                        newMessages.push({
                            user: "dracolab",
                            isSwap: true,
                            action: "NONE",
                            text: "Swap"
                        })
                        // setSwap(data);

                        setMessages(newMessages);
                    } else {
                        const newMessages = [...messages]
                        newMessages.push({
                            user: "dracolab",
                            action: "NONE",
                            text: data?.message
                        })
                        setMessages(newMessages);
                    }
                    return
                }

                if (data?.isTransfer !== undefined) {
                    setTokenIn(formatResponseTokenInOut(data?.token_in))
                    setAddressReceipt(formatResponseTokenInOut(data?.address))
                    setAmount(data?.amount)
                    if (data?.isTransfer) {
                        console.log("Show phần transfer")
                        const newMessages = [...messages]
                        newMessages.push({
                            user: "dracolab",
                            isTransfer: true,
                            action: "NONE",
                            text: data?.message || "Transfer"
                        })
                        // setTransfer(data);
                        setMessages(newMessages);
                    } else {
                        const newMessages = [...messages]
                        newMessages.push({
                            user: "dracolab",
                            action: "NONE",
                            text: data?.message
                        })
                        setMessages(newMessages);
                    }
                    return
                }

                return
            }
            // setMessages((prev) => [...prev, ...data]);
            const newMessages = [...messages]
            newMessages.push(data?.[0] || {})
            setMessages(newMessages);
            setSelectedFile(null);
        },
    });

    useEffect(() => {
        initPrice()
    }, [])

    useEffect(() => {
        if (!account?.address) return
        initBalance()
    }, [account?.address])

    const initPrice = async () => {
        const newPrice = { ...price };
        for (const token in TOKEN_ADDRESS_CONSTANT) {
            if (TOKEN_ADDRESS_CONSTANT.hasOwnProperty(token)) {
            const dataPrice = await getTokenDataByTokenAddress(TOKEN_ADDRESS_CONSTANT[token]);
            newPrice[token] = dataPrice.priceUsd;
      }
    }
    setPrice(newPrice);
    console.log('newPrice', price)
  };


    const initBalance = async () => {
      const newBalance = { ...balance };
      if (account?.address) {
        console.log(account.address, "account.address");
        for (const token in TOKEN_ADDRESS_CONSTANT) {
          if (TOKEN_ADDRESS_CONSTANT.hasOwnProperty(token)) {
            const dataBalance = await getTokenBalance(
              TOKEN_ADDRESS_CONSTANT[token],
              account.address
            );
            //console.log("dataBalance", dataBalance);
            newBalance[token] = dataBalance / DECIMAL[token];
          }
        }
      }
      setBalance(newBalance);
      console.log(balance, "balance");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() && !selectedFile) return;

        // Add user message immediately to state
        const userMessage = {
            text: input,
            user: "user",
            attachments: selectedFile ? [{ url: URL.createObjectURL(selectedFile), contentType: selectedFile.type, title: selectedFile.name }] : undefined,
        };
        setMessages((prev) => [...prev, userMessage]);

        const predefinedResponse = predefinedResponses[input.trim()];
        if (predefinedResponse) {
            setTimeout(() => {
                const botMessage = {
                    text: predefinedResponse,
                    user: "bot",
                };
                setMessages((prev) => [...prev, botMessage]);
            }, Math.random() * 1000 + 2000); // Add a delay of 2-3 seconds
        } else {
            mutation.mutate(input);
        }
        setInput("");
    };

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
        }
    };

    return (
        <div className="flex flex-col w-full" style={{height: height-84}} >
            <div className="flex-1 min-h-0 overflow-y-auto p-4 pt-8 " ref={chatContainerRef}>
                <div className="max-w-3xl mx-auto space-y-4" >
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`text-left flex ${message.user === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] bg-[#161620] rounded-lg px-4 py-2 ${message.user === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                        } message-content`}
                                >
                                    {message.user === "user" ? message.text : <TypeWriterText text={message.text} />}
                                    {message.attachments?.map((attachment, i) => (
                                        attachment.contentType.startsWith('image/') && (
                                            <img
                                                key={i}
                                                src={message.user === "user"
                                                    ? attachment.url
                                                    : attachment.url.startsWith('http')
                                                        ? attachment.url
                                                        : `http://localhost:3000/media/generated/${attachment.url.split('/').pop()}`
                                                }
                                                alt={attachment.title || "Attached image"}
                                                className="mt-2 max-w-full rounded-lg"
                                            />
                                        )
                                    ))}
                                    {message?.isTopKOL && <TopKOL topKOL={message?.data} />}
                                    {message?.isTopCoin && <TopCoin topCoin={message?.data} />}
                                    {message?.isTopToken && <TopToken topToken={message?.data} handleClick={(token) => {
                                        const tokenPairs = token?.pair?.split("/")
                                        setTokenIn(tokenPairs[0])
                                        setTokenOut(tokenPairs[1])
                                        setIsSwap(true)
                                        const newMessages = [...messages]
                                        newMessages.push({
                                            user: "dracolab",
                                            action: "NONE",
                                            text: `How much ${tokenPairs[0]} would you like to swap for ${tokenPairs[1]}?`
                                        })
                                        setMessages(newMessages);
                                    }} />}
                                    {message?.isSwap && <Swap token_in={tokenIn} token_out={tokenOut} amount={amount} />}
                                    {message?.isTransfer && <Transfer amount={amount} token={tokenIn} address={addressReceipt} />}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No messages yet. Start a conversation!
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t p-4 bg-background">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1"
                            disabled={mutation.isPending}
                            ref={inputRef}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleFileSelect}
                            disabled={mutation.isPending}
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "..." : "Send"}
                        </Button>
                    </form>
                    {selectedFile && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            Selected file: {selectedFile.name}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
