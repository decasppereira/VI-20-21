import pandas as pd
import itertools

#data2 = pd.read_csv("DataExtract2.csv", delimiter=",", encoding="latin1")
data = pd.read_csv("../data/air_quality_CO.csv", delimiter=",", encoding="latin1")

#data.drop(["Air Quality Network","Air Quality Network Name","Unit Of Air Pollution Level","Air Quality Station EoI Code","Air Quality Station Name","Sampling Point Id","Data Aggregation Process Id","Data Aggregation Process","Data Coverage","Verification","Air Quality Station Type","Air Quality Station Area","Longitude","Latitude","Altitude","City","City Code","City Population","Source Of Data Flow","Calculation Time","Link to raw data (only E1a/validated data from AQ e-Reporting)"],axis=1,inplace=True)
#data.drop(["Air Pollutant","Air Pollutant Description"],axis=1, inplace=True)
data = data[data["Year"] >= 1990]

data = data.groupby(['Country','Year'])['Air Pollution Level'].mean()
data=data.reset_index()

#country_list = ["Austria","Belgium","Bulgaria","Cyprus","Denmark","Czechia","Croatia","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Iceland","Lithuania","Luxembourg","Malta","Netherlands","Norway","Poland","Portugal","Romania","Sweden","Slovenia","Slovakia","Spain","Turkey"]

#data = data[data["Country"].isin(country_list)]
#data.sort_values(['Country', 'Year'], ascending=[True, True], inplace=True)

years = list(set(data["Year"]))
countries = sorted(list(set(data["Country"])))

list_tuples = list(zip(data["Country"],data["Year"],data["Air Pollution Level"]))

data2_f = []
aux = []
count = 1990

for country in countries:
    count = 1990
    aux = []
    while count <= 2021:
        for k,tuple in enumerate(list_tuples):
     
            if tuple[0] != country: 
                continue
            if tuple[0] not in aux: #We add the country to the aux list and all other values comming after are the air pollution levels for each year
                aux.append(tuple[0])

            if tuple[1] != count:
                while count < tuple[1]:
                    count+=1
                    aux.append(0)
            if tuple[1] == count:
                aux.append(tuple[2])
                count+=1

            if k == len(list_tuples)-1: #This is an exception for the last element of the list_tuples, since there is no information for Turkey in 2021
                data2_f.append(aux)
                break
            if count > 2021 or list_tuples[k+1][0] != country:
                data2_f.append(aux)
                break
        break
   


data2 = pd.DataFrame(data2_f,columns=["Country",1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021])
data2 = data2.fillna(0)
#print(data2)

# Export as csv

data2.to_csv("air_quality_CO.csv", index=False,header=True)