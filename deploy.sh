#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

clear

# Check if master branch exists
if ! git rev-parse --verify master >/dev/null 2>&1; then
    echo -e "${RED}Error: 'master' branch not found.${NC}"
    exit 1
fi

# Check if main branch exists
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
    echo -e "${RED}~~~~~ entered nothing exiting ~~~~~${NC}"
    exit 1
else
    echo -e "${GREEN}committing to master. message = $MESSAGE${NC}"
    git commit -m "$MESSAGE"

    echo -e "\n${GREEN}~~~~~ pushing from master. message = $MESSAGE ~~~~~${NC}"
    git push
    git status

    git checkout main
    echo -e "\n${YELLOW}~~~~~ now in main ~~~~~${NC}"
    git merge master -m "$MESSAGE"
    if [[ $? -ne 0 ]]; then
        echo -e "${RED}Merge conflict detected!${NC}"
        while true; do
            echo -e "${YELLOW}Please resolve all conflicts, then press Enter to continue...${NC}"
            read
            # Check if conflict markers still exist
            if grep -r --exclude="deploy.sh" --exclude-dir=".git" '<<<<<<<\|=======\|>>>>>>>' .; then
                echo -e "${RED}Conflict markers still present. Please resolve them before continuing.${NC}"
            else
                echo -e "${GREEN}No conflict markers found. Proceeding...${NC}"
                break
            fi
        done
    fi
    git add -A

    echo -e "\n${GREEN}committing to main. message = $MESSAGE${NC}"
    git commit -m "$MESSAGE"

    echo -e "\n${GREEN}~~~~~ pushing from main. message = $MESSAGE ~~~~~${NC}"
    git push
    git status

    git checkout master
    echo -e "${YELLOW}now in master.${NC}"

    echo -e "\n${GREEN}~~~~~ finished auto deploying ~~~~~${NC}\n"
fi
