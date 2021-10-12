import pandas as pd

#data2 = pd.read_csv("DataExtract2.csv", delimiter=",", encoding="latin1")
data = pd.read_csv("../data/air_quality_CO.csv", delimiter=",", encoding="latin1")

#data.drop(["Air Quality Network","Air Quality Network Name","Unit Of Air Pollution Level","Air Quality Station EoI Code","Air Quality Station Name","Sampling Point Id","Data Aggregation Process Id","Data Aggregation Process","Data Coverage","Verification","Air Quality Station Type","Air Quality Station Area","Longitude","Latitude","Altitude","City","City Code","City Population","Source Of Data Flow","Calculation Time","Link to raw data (only E1a/validated data from AQ e-Reporting)"],axis=1,inplace=True)
data.drop(["Air Pollutant","Air Pollutant Description"],axis=1, inplace=True)
data = data[data["Year"] >= 1990]

data = data.groupby(['Country','Year'])['Air Pollution Level'].mean()
data=data.reset_index()

country_list = ["Austria","Belgium","Bulgaria","Cyprus","Denmark","Czechia","Croatia","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Iceland","Lithuania","Luxembourg","Malta","Netherlands","Norway","Poland","Portugal","Romania","Sweden","Slovenia","Slovakia","Spain","Turkey"]

#data = data[data["Country"].isin(country_list)]
#data.sort_values(['Country', 'Year'], ascending=[True, True], inplace=True)


print(data.head())


# Export as csv

data.to_csv("air_quality_CO.csv", index=False,header=True)