import pandas as pd
import itertools
import numpy as np

#data2 = pd.read_csv("DataExtract2.csv", delimiter=",", encoding="latin1")
country_list = ["year","Austria","Belgium","Bulgaria","Cyprus","Czech Republic","Germany","Denmark","Spain","Estonia","Greece","Croatia","France","Finland","Iceland","Italy","Ireland","Hungary","Netherlands","Malta","Lithuania","Luxembourg","Norway","Romania","Portugal","Poland","Slovenia","Turkey","Slovakia","Sweden"]

data = pd.read_csv("../data/emissions_totals_renewed.csv", delimiter=",", encoding="latin1")

data = data[data.Year != "2030_target"]
data = data[data.Year != "2050_target"]
data.to_csv("emissions_totals_renewed.csv", index=False,header=True)


#after_year = data[data["Year"] >= 2000]

#after_year = after_year[after_year["Year"] <= 2018]

#after_year = data
#after_year = after_year.groupby(["Country", "Year"]).mean()
#after_year.to_csv("air_quality_CO_try.csv", index=True,header=True)

dataa = pd.read_csv("../data/annual_avg_temp.csv", delimiter=",", encoding="latin1")
print(dataa)
#after_year_dataa = dataa[dataa["Year"] >= 2000]

#after_year_dataa = after_year_dataa[after_year_dataa["Year"] <= 2018]
#after_year_dataa= dataa

#after_year_dataa = after_year_dataa.groupby(["Country", "Year"]).mean()
#after_year_dataa.to_csv("fires_try.csv", index=True,header=True)

#new_data = pd.merge(data,after_year_dataa,how="left",left_on=["Country","Year"],right_on=["Country","Year"])
#new_data=new_data.rename(columns={"Value_x": "Air_Quality_CO", "Value_y": "Fires"})
#new_data=new_data.fillna(0)
#new_data.to_csv("merge_air_fires.csv", index=True,header=True)

all_data = dataa.values.tolist()
years_list = [i for i in range(1901,2021)]
yearsssss = []
values = []
c_list = []
lst_append = []
for lst in all_data:
    cy = str(lst[0].split(";")[0])
    lst = lst[0].split(";")
    lst = lst[1:]
    for value in lst:
        c_list.append(cy)
        values.append(value)
    for year in years_list:
        yearsssss.append(year)

d = {"Country":c_list,"Year":yearsssss,"Value":values}
d1 = pd.DataFrame(data=d)
print(d1)
d1.to_csv("annual_avg_temp_renewed.csv", index=False,header=True)


#data.drop(["Air Quality Network","Air Quality Network Name","Unit Of Air Pollution Level","Air Quality Station EoI Code","Air Quality Station Name","Sampling Point Id","Data Aggregation Process Id","Data Aggregation Process","Data Coverage","Verification","Air Quality Station Type","Air Quality Station Area","Longitude","Latitude","Altitude","City","City Code","City Population","Source Of Data Flow","Calculation Time","Link to raw data (only E1a/validated data from AQ e-Reporting)"],axis=1,inplace=True)
#data.drop(["Air Pollutant","Air Pollutant Description"],axis=1, inplace=True)
#data = data[data["Year"] >= 1990]

#data = data.groupby(['Country','Year'])['Air Pollution Level'].mean()
#data=data.reset_index()


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

#data2.to_csv("air_quality_CO.csv", index=False,header=True)