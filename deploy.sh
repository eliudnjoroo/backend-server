#!/bin/bash
set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear

# Check for master branch
if ! git rev-parse --verify master >/dev/null 2>&1; then
    echo -e "${RED}Error: 'master' branch not found.${NC}"
    exit 1
fi

# Check for main branch
if ! git rev-parse --verify main >/dev/null 2>&1; then
    echo -e "${RED}Error: 'main' branch not found.${NC}"
    exit 1
fi

git checkout master
echo -e "\n${YELLOW}~~~~~ auto deploying ~~~~~${NC}\n"
git status
git add -A

echo -e "\n${YELLOW}~~~~~ enter commit message ~~~~~${NC}\n"
read MESSAGE

if [[ -z $MESSAGE ]]; then
    echo -e "${RED}~~~~~ entered nothing, exiting ~~~~~${NC}"
    exit 1
fi

if [[ $1 == "--dry-run" ]]; then
    echo -e "${YELLOW}Dry run mode. The following would be executed:${NC}"
    echo "Commit message: $MESSAGE"
    echo "git commit -m \"$MESSAGE\""
    echo "git push"
    echo "git merge master -m \"$MESSAGE\" (on main)"
    echo "git commit -m \"$MESSAGE\""
    echo "git push"
    exit 0
fi

echo -e "${GREEN}Committing to master. Message = \"$MESSAGE\"${NC}"
git commit -m "$MESSAGE"

echo -e "\n${GREEN}~~~~~ pulling latest from master before push ~~~~~${NC}"
git pull origin master --rebase

echo -e "\n${GREEN}~~~~~ pushing from master. Message = \"$MESSAGE\" ~~~~~${NC}"
git push
git status

git checkout main
echo -e "\n${YELLOW}~~~~~ now in main ~~~~~${NC}"
git merge master -m "$MESSAGE"
git add -A

echo -e "\n${GREEN}Committing to main. Message = \"$MESSAGE\"${NC}"
git commit -m "$MESSAGE"

echo -e "\n${GREEN}~~~~~ pushing from main. Message = \"$MESSAGE\" ~~~~~${NC}"
git push
git status

git checkout master
echo -e "${YELLOW}Now in master.${NC}"
echo -e "\n${GREEN}~~~~~ finished auto deploying ~~~~~${NC}\n"
