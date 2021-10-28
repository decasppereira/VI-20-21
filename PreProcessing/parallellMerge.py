import pandas as pd
import numpy as np

country_list = ["Austria","Belgium","Bulgaria","Cyprus","Denmark","Czechia","Croatia","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Iceland","Lithuania","Luxembourg","Malta","Netherlands","Norway","Poland","Portugal","Romania","Sweden","Slovenia","Slovakia","Spain","Turkey"]

airQ = pd.read_csv("../data/air_quality_CO.csv", delimiter=",", encoding="latin1")
fires = pd.read_csv("../data/fires_hectars.csv", delimiter=",", encoding="latin1")
emissions = pd.read_csv("../data/emissions_totals_renewed.csv", delimiter=",", encoding="latin1")
temp = pd.read_csv("../data/annual_avg_temp.csv", delimiter=",", encoding="latin1")

airQ = airQ.groupby(["Country"]).mean()
airQ.drop(["Year"],axis=1,inplace=True)

fires = fires.groupby(["Country"]).mean()
fires.drop(["Year"],axis=1,inplace=True)

emissions = emissions.groupby(["Country"]).mean()
print(emissions)



merged = pd.DataFrame()
