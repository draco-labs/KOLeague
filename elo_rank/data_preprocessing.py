def round_up_time(ts, mode='15m'):
    """
    Rounds up a given timestamp to the nearest interval based on the specified mode.
    
    Parameters:
        ts (pd.Timestamp): The input timestamp to be rounded.
        mode (str): The rounding mode, one of '15m', '1h', or '4h'.
    
    Returns:
        pd.Timestamp: The rounded timestamp.
    """
    if mode == '15m':
        # Calculate the nearest 15-minute interval
        nearest_15m = ((ts.minute + 15) // 15) * 15
        if nearest_15m == 60:  # Handle overflow to the next hour
            ts += pd.Timedelta(hours=1)
            nearest_15m = 0
        return ts.replace(minute=nearest_15m, second=0, microsecond=0)

    elif mode == '1h':
        # Calculate the nearest hour
        nearest_1h = ts.hour + 1 if ts.minute > 0 or ts.second > 0 or ts.microsecond > 0 else ts.hour
        if nearest_1h == 24:  # Handle overflow to the next day
            ts += pd.Timedelta(days=1)
            nearest_1h = 0
        return ts.replace(hour=nearest_1h, minute=0, second=0, microsecond=0)

    elif mode == '4h':
        # Calculate the nearest 4-hour interval
        nearest_4h = ((ts.hour + 4) // 4) * 4
        if nearest_4h == 24:  # Handle overflow to the next day
            ts += pd.Timedelta(days=1)
            nearest_4h = 0
        return ts.replace(hour=nearest_4h, minute=0, second=0, microsecond=0)

    else:
        raise ValueError("Invalid mode. Choose one of '15m', '1h', or '4h'.")


def load_sentiment_data():
    # Load sentiment files
    
    # auto labeling
    sdf=pd.read_csv('twitter_data_type_all.csv')
    sdf=sdf[(sdf['term_classification']=='short-term')&(sdf['action_prompt']!='hold')]
    sdf=sdf[sdf['type']==1]
    
    # manual labeling
    #sdf=pd.read_csv('RankKOL - Match_history_24_10_17.csv')
    #sdf=sdf[(sdf['term_classification']=='short-term')&(sdf['action_prompt']!='hold')]
    
    #print(sdf)
    
    # chuan bi file
    sdf['timestamp'] = pd.to_datetime(sdf['timestamp'])
    
    # DEBUG CHECK
    #sdf = sdf[sdf['timestamp'].dt.date <= pd.to_datetime('2024-12-01').date()]
    
    sdf['tweet_time']=sdf['timestamp']
    sdf = sdf.sort_values(['timestamp'])
    print('sdf before round\n',sdf.head(10))
    # lam tron timestamp
    sdf['timestamp'] = sdf['timestamp'].map(round_up_time)
    
    sdf['after_15m'] = sdf['timestamp'] + pd.Timedelta(minutes=15)
    sdf['after_30m'] = sdf['timestamp'] + pd.Timedelta(minutes=30)
    sdf['after_1h'] = sdf['timestamp'] + pd.Timedelta(hours=1)
    sdf['after_3h'] = sdf['timestamp'] + pd.Timedelta(hours=3)
    sdf['after_4h'] = sdf['timestamp'] + pd.Timedelta(hours=4)
    sdf['after_24h'] = sdf['timestamp'] + pd.Timedelta(hours=24)
    
    print('sdf after round\n',sdf.head(10))
    
    return sdf


def extract_coin_data():

    coin_list=os.listdir('coin_data')
    
    coin_dict={}
    
    exclude_list=[]
    
    for coin in coin_list:
        print('reading file',coin)
        file_path = os.path.join('coin_data', coin)  # Construct the full file path
        try:
            df = pd.read_csv(file_path)  # Read the CSV file
            coin_name = os.path.splitext(coin)[0]  # Remove the  .csv extension for the coin name
            coin_dict[coin_name] = df  # Assign the DataFrame to the coin's name in the dictionary
        except:
            print(file_path,'not validated')
    coin_list = [coin for coin in coin_dict]
    #coin_list=[i[:-4] for i in coin_list] # ?
    return coin_list,coin_dict


  

def create_tweet_table(coin_list,sdf,coin_dict,debug_case=False):
    tweet_df = pd.DataFrame()
    
    for coin in tqdm(coin_list, desc='merging'):
        
        # debug check 1
        if debug_case:
            if not coin==debug_case:
                continue
            else:
                print('###debug create_tweet_table')
                print('check coin',debug_case)
        
        print('coin', coin)
        single_sdf = sdf[sdf['detected_coins'] == coin]
        single_cdf = coin_dict[coin]
        print('single_cdf',single_cdf)
        single_cdf['timestamp'] = pd.to_datetime(single_cdf['date'])
        
        
        
        #Remove time zone information(timestamp in tweet time and coin_df already utc)        
        single_sdf['timestamp'] = single_sdf['timestamp'].dt.tz_localize(None)
        single_cdf['timestamp'] = single_cdf['timestamp'].dt.tz_localize(None)
        
        #debug chec 2
        if debug_case:
            print('###debug create_tweet_table')
            print('coin df\n',single_cdf)
            print('sentiment df\n',single_sdf)
        # Merge the tweet data with the price data at the time of the tweet
        
        roi_df = single_sdf.merge(single_cdf[['timestamp', 'close']], how='left', on='timestamp')
        
        for time_range in ['after_15m','after_30m','after_1h','after_3h','after_4h','after_24h']:
            price_range_df = single_sdf[['id',time_range]].merge(single_cdf[['timestamp', 'close']], how='left',
                                         right_on='timestamp',
                                         left_on=time_range)
            price_range_df['price_'+time_range]=price_range_df['close']
            price_range_df=price_range_df.drop(['timestamp','close',time_range],axis=1)
            roi_df=roi_df.merge(price_range_df,on='id',how='left')
    
    
        #debug check 3
        if debug_case:
            print('after merge')
            print('roi_df\n',roi_df)
        
        #### Add the price at the end of the next day for checking ############
        
        roi_df['timestamp_2'] = (roi_df['timestamp'] + pd.DateOffset(days=2)).apply(lambda x: x.normalize())
        
        roi_df = roi_df.merge(single_cdf[['timestamp', 'close']], how='left', left_on='timestamp_2', right_on='timestamp')
        
        # Rename columns for clarity
        roi_df = roi_df.rename(columns={'timestamp_2': 'check_time', 'close_x': 'price_at_call', 'close_y': 'price_at_check'})
        
        # Calculate ROI
        roi_df['ROI'] = (roi_df['price_at_check'] - roi_df['price_at_call']) / roi_df['price_at_call'] * 100
    
        roi_df['ROI_15m'] = (roi_df['price_after_15m'] - roi_df['price_at_call']) / roi_df['price_at_call'] * 100
        roi_df['ROI_30m'] = (roi_df['price_after_30m'] - roi_df['price_at_call']) / roi_df['price_at_call'] * 100
        roi_df['ROI_1h'] = (roi_df['price_after_1h'] - roi_df['price_at_call']) / roi_df['price_at_call'] * 100
        roi_df['ROI_3h'] = (roi_df['price_after_3h'] - roi_df['price_at_call']) / roi_df['price_at_call'] * 100
        roi_df['ROI_4h'] = (roi_df['price_after_4h'] - roi_df['price_at_call']) / roi_df['price_at_call'] * 100
        roi_df['ROI_24h'] = (roi_df['price_after_24h'] - roi_df['price_at_call']) / roi_df['price_at_call'] * 100
    
    
        
        # Reverse ROI for 'sell' action
        roi_df.loc[roi_df['action_prompt'] == 'sell', 'ROI'] = -roi_df['ROI']
        
        # Drop unnecessary columns
        drop_list=['type', 'create_at', 'created_record_at', 'lang', 'sentiment_prompt', 
                   'updated_record_at', 'user_id', 'run_id', 'timestamp_x', 'timestamp_y',
                   'after_15m','after_30m','after_1h','after_3h','after_4h','after_24h',
                   'price_after_15m','price_after_30m','price_after_1h','price_after_3h','price_after_4h','price_after_24h'
                   ]
        
        for col in drop_list:
            try:
                roi_df = roi_df.drop(col, axis=1)
            except:
                pass
        # Drop rows with missing values
        #roi_df = roi_df.dropna()
        
        # Add coin column
        roi_df['coin'] = coin
        
        # Additional fix: when the tweet time is after 20h, it will be round up to 
        # 0h which will have the checktime being shift to one day compare to tweet
        # that are posted before 20h
        roi_df.loc[roi_df['tweet_time'].dt.hour >= 20, 'check_time'] -= pd.Timedelta(days=1)
    
        # Append the data to the main DataFrame
        if tweet_df.empty:
            tweet_df = roi_df
        else:
            tweet_df = pd.concat([tweet_df, roi_df], ignore_index=True)  # Avoid resetting index manually
            
    
    # cutting off 
    tweet_df['tweet_time'] = pd.to_datetime(tweet_df['tweet_time'])
    tweet_df=tweet_df.sort_values(['tweet_time'])
    
    tweet_df['tweet_date'] = pd.to_datetime(tweet_df['tweet_time']).dt.date
    
    tweet_df=tweet_df.drop_duplicates(['detected_coins','screen_name','tweet_date'],keep='first')
    
    tweet_df=tweet_df[tweet_df['tweet_time']>=pd.to_datetime('2023-01-01')]
            

    return tweet_df

def filter_tweet_table(tweet_df):

    unique_coin_date_combinations = tweet_df.groupby(['detected_coins', 'tweet_date']).size().reset_index(name='count')
    
    
    #filtered_combinations = unique_coin_date_combinations[unique_coin_date_combinations['count'] >3]
    
    # Now filter the original dataframe to include only rows that have the same 'detected_coins' and 'tweet_date' as in the filtered_combinations
    filtered_tweets = tweet_df.merge(unique_coin_date_combinations[['detected_coins', 'tweet_date']], 
                                     on=['detected_coins', 'tweet_date'], 
                                     how='inner')
    
    filtered_tweets=filtered_tweets.drop('id',axis=1)
    return filtered_tweets


def loading_previous_battle_record(filtered_tweets):

    file_name = 'match.csv'
    
    
    last_tweet_time=pd.to_datetime('2022-01-01')
    
    if os.path.exists(file_name):
        print(f"{file_name} exists.")
        match_df=pd.read_csv(file_name)
        match_df=match_df.sort_values('tweet_date')
        match_df['tweet_date']=pd.to_datetime(match_df['tweet_date'])#, format='mixed')# convert since the original is a string
        match_df['tweet_date'] = match_df['tweet_date'].dt.date
        last_tweet_time = pd.to_datetime(match_df['tweet_date'].max())
        elo_df = match_df.groupby('screen_name')['elo_after'].last().reset_index()
        elo_df.rename(columns={'elo_after': 'elo'}, inplace=True)
        match_id_inititate=match_df['match_id'].max()
    
    
    else:
        print(f"{file_name} does not exist.")
        match_id_inititate=0
        match_df = pd.DataFrame(columns=filtered_tweets.columns)
        match_df=match_df.rename(columns={'elo':'elo_before'})
        match_df['elo_after']=[]
        match_df['elo_change']=[]
        match_df['match_id']=[]
        match_df['game_result']=[]
        elo_df=filtered_tweets[['screen_name']].drop_duplicates()
        elo_df['elo']=1000
    print('last_tweet_time',last_tweet_time)
     
    
    filtered_tweets = filtered_tweets[filtered_tweets['tweet_date'] >= last_tweet_time.date()]
    return match_df,elo_df,filtered_tweets,match_id_inititate


