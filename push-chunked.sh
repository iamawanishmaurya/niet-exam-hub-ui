#!/bin/bash
cd /home/astra/niet_exam_hub2/nietexamhub-main/tmp-ppt-data-repo

echo "Resetting git repository to ensure clean chunks..."
rm -rf .git
git init
git remote add origin https://github.com/Niet-College/niet-ppt-data.git
git branch -M main

for POST in "README.md" "Semester I" "Semester II" "Semester III" "Semester IV" "Semester V" "Semester VI" "Semester VII" "Semester VIII" 
do
  if [ -e "$POST" ]; then
    echo "======================================="
    echo "Uploading $POST to Github..."
    git add "$POST"
    git commit -m "Add $POST PPTs"
    git push -u origin main --progress
    echo "======================================="
    echo "Successfully pushed $POST"
  fi
done
