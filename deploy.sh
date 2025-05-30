#!/bin/bash
clear
git checkout master
echo -e "\n~~~~~ auto deploying ~~~~~\n"
git status
git add *
echo -e "\n~~~~~ enter commit message ~~~~~\n"
read MESSAGE_RAW
MESSAGE=\'$MESSAGE_RAW\'
if  [[ -z $MESSAGE ]]
then
    echo -e "\n~~~~~ must enter commit message ~~~~~\n"
else
    echo commiting to master. message = $MESSAGE
    git commit -m $MESSAGE
    echo  -e "\n~~~~~pushing from master. message = $MESSAGE~~~~~"
    git push
    git status
    git checkout main
    echo  -e "\n~~~~~now in main~~~~~"
    git merge master -m $MESSAGE
    git add *
    echo  -e "\n~~~~~commiting to main. message = $MESSAGE~~~~~"
    git commit -m $MESSAGE
    echo  -e "\n~~~~~pushing from main. message = $MESSAGE~~~~~" 
    git push
    git status
    git checkout master
    echo now in master.

    echo -e "\n~~~~~ finished auto deploying ~~~~~\n"
fi