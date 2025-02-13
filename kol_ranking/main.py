
from data_obtaining import get_coin, generate_date_ranges, get_coin_data
from data_obtaining import get_sentimental_data, get_top_coin, downloading_top_coins, downloading_old_coins
from data_preprocessing import round_up_time,load_sentiment_data,extract_coin_data,create_tweet_table
from data_preprocessing import filter_tweet_table, loading_previous_battle_record
from matchmaking_and_ranking import matchmaking,generating_html_dashboard,match_history_to_json,add_parameter
from matchmaking_and_ranking import finalizing,kol_data_to_json


if __name__ == "__main__":
    
    # download data
    
    
    # ignore misdetect hashtag, and tweet with more than one coin
    top_coins=get_sentimental_data(exclude_list = ["COIN", "AI","ATH","NFT"],
                                   single_coin=True,top=3) 
    # note: ATH = all time highest
    
    print('coin in twitter data',top_coins)
    downloading_top_coins(top_coins)
    
    # extract data
    sdf=load_sentiment_data()
    coin_list,coin_dict=extract_coin_data()
    tweet_df=create_tweet_table(coin_list,sdf,coin_dict)#,debug_case='DOGE')
    
    
    filtered_tweets=filter_tweet_table(tweet_df)
    
    match_df,elo_df,filtered_tweets,match_id_inititate=loading_previous_battle_record(filtered_tweets)
    
    
    #add historical data_batlte
    coin_dict,coin_list=downloading_old_coins(match_df,coin_dict,coin_list)
    

    #match_df=matchmaking_old(filtered_tweets,elo_df,match_df,match_id_inititate)
    match_df=matchmaking(filtered_tweets,elo_df,match_df,match_id_inititate)
    final_table, match_df_origin=finalizing(match_df)        
    
    #get open interest data
    
    mdf,detailed_mdf=match_history_to_json(match_df_origin,coin_dict)
    
    final_table=add_parameter(match_df_origin,final_table)
                              
    kol_data_to_json(mdf,final_table)