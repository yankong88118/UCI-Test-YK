import os
import csv

PyPoll_csv=os.path.join('Resources','election_data.csv')
#for total votes, candidate list,candidate percentage
with open(PyPoll_csv,"r") as csvfile:
    csvreader = csv.reader(csvfile,delimiter=',')
    header=next(csvreader)
    vote_counts=[]
    candidate_list=[]
    candidate1_votes_list=[]
    candidate2_votes_list=[]
    candidate3_votes_list=[]
    candidate4_votes_list=[]
    for row in csvreader:
        vote_counts.append(str(row[0]))
        if row[2] not in candidate_list:
            candidate_list.append(str(row[2]))
        if row[2]=="Khan":
            candidate1_votes_list.append(str(row[2]))
        if row[2]=="Correy":
            candidate2_votes_list.append(str(row[2]))
        if row[2]=="Li":
            candidate3_votes_list.append(str(row[2]))
        if row[2]=="O'Tooley":
            candidate4_votes_list.append(str(row[2]))
candidate1_votes=len(candidate1_votes_list)
candidate2_votes=len(candidate2_votes_list)
candidate3_votes=len(candidate3_votes_list)
candidate4_votes=len(candidate4_votes_list)
Total_votes=len(vote_counts)
votes_count_list=[candidate1_votes,candidate2_votes,candidate3_votes,candidate4_votes]
the_winner_count=max(votes_count_list)
candidate1=(candidate1_votes/Total_votes)*100
candidate2=(candidate2_votes/Total_votes)*100
candidate3=(candidate3_votes/Total_votes)*100
candidate4=(candidate4_votes/Total_votes)*100
print(f"Total Votes are {len(vote_counts)}")
print(f"Candidates are: {candidate_list}")
print(f"Khan: {candidate1}%")
print(f"Correy: {candidate2}%")
print(f"Li: {candidate3}%")
print(f"O'Tooley: {candidate4}%")
#find the winner
output_path = os.path.join("Resources", "new.csv")
# Open the file using "write" mode. Specify the variable to hold the contents
with open(output_path, 'w',newline="") as csvfile11:
    # Initialize csv.writer
    csvwriter = csv.writer(csvfile11, delimiter=',')
    # Write the rows (column headers)
    csvwriter.writerow(['Candidate', 'Votes'])
    csvwriter.writerow(['Khan', candidate1_votes])
    csvwriter.writerow(['Correy', candidate2_votes])
    csvwriter.writerow(['Li', candidate3_votes])
    csvwriter.writerow(["O'Tooley", candidate4_votes])
winner_csv=os.path.join('Resources','new.csv')
with open(winner_csv) as csvfile1:
    csvreader1 = csv.reader(csvfile1,delimiter=',')
    header=next(csvreader1)
    for row in csvreader1:
        if int(row[1]) == the_winner_count:
            print(f"The Winner is {row[0]}")