import pandas as pd
import numpy as np

country_list = ["Austria","Belgium","Bulgaria","Cyprus","Denmark","Czechia","Croatia","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Iceland","Lithuania","Luxembourg","Malta","Netherlands","Norway","Poland","Portugal","Romania","Sweden","Slovenia","Slovakia","Spain","Turkey"]

airQ = pd.read_csv("../data/air_quality_CO.csv", delimiter=",", encoding="latin1")
fires = pd.read_csv("../data/fires_hectars.csv", delimiter=",", encoding="latin1")
emissions = pd.read_csv("../data/emissions_totals_renewed.csv", delimiter=",", encoding="latin1")
temp = pd.read_csv("../data/annual_avg_temp_renewed.csv", delimiter=",", encoding="latin1")

airQ = airQ.groupby(["Country"]).mean()
airQ = airQ.rename(columns={'Value': 'AirQ'})
airQ.drop(["Year"],axis=1,inplace=True)

fires = fires.groupby(["Country"]).mean()
fires = fires.rename(columns={'Value': 'Fires'})
fires.drop(["Year"],axis=1,inplace=True)

emissions = emissions.groupby(["Country"]).mean()
emissions = emissions.rename(columns={'Value': 'Emissions'})

temp = temp.groupby(["Country"]).mean()
temp = temp.rename(columns={'Value': 'Temp'})
temp.drop(["Year"],axis=1,inplace=True)
print(temp)

merged = airQ.merge(fires, left_on='Country', right_on='Country')
merged = merged.merge(emissions, left_on='Country', right_on='Country')
merged = merged.merge(temp, left_on='Country', right_on='Country')


print(merged)
merged.to_csv("mergedAverages.csv", index=True,header=True)