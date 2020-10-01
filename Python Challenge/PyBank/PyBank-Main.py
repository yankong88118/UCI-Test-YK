import os
import csv
#path to data
PyBank_csv=os.path.join('Resources','budget_data.csv')
#total duration
total_month=len(open(PyBank_csv,'r').readlines())-1
print(f"total month: {total_month}")
#total profit/loss amount
with open(PyBank_csv,"r") as csvfile:
    csvreader = csv.reader(csvfile,delimiter=',')
    header=next(csvreader)
    Amount_list=[]
    for row in csvreader:
        Amount_list.append(int(row[1]))
        Date=str(row[0])
    total_amount=sum(Amount_list)
    Greatest_Increase=max(Amount_list)
    Greatest_Decrease=min(Amount_list)
    print(f"total pofit/loss:{total_amount}")
    print(f"Average:{total_amount/total_month}")
    print(f"The Greatest_Increase:{Date} & {Greatest_Increase}")
    print(f"The Greatest_Decrease:{Date} & {Greatest_Decrease}") 


