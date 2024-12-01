# Git and GitHub setup and useage notes

---

## Developer Setup

- Get the PAT (Personal Access Token) key from our chat group
- Wherever you see '<PAT>' replace it with the text of the PAT

### Clone the repo
```bash
mkdir mission-03-ai-interview-chatbot && cd mission-03-ai-interview-chatbot/
git clone https://github.com/Astrotope/mr-level-05-fsd-mission-03-ai-interview-chatbot cd mr-level-05-fsd-mission-03-ai-interview-chatbot
```

### Setup the remote
```bash
git remote remove origin
git remote add origin https://<PAT>@github.com/Astrotope/mr-level-05-fsd-mission-03-ai-interview-chatbot.git
```

### Confirm your in the main branch 

```bash
git status
```
```bash
On branch master
Your branch is up to date with 'origin/master'.
nothing to commit, working tree clean
```
 
### Set up your Git User Identity (with your details!) 

- These settings are local and only apply to this repository.

```bash
git config user.name "Dev Name" 
git config user.email "dev_email@missionreadyhq.com"
```
 
### Create a feature branch using git worktrees

- Cool feature, that eases working with multiple branches
- You can have the main branch and your feature branch in separate directories and move between them.
- No more stash, checkout

```bash
git worktree add -b feature/ai-chatbot ../ai-chatbot 
cd ../ai-chatbot  # Check your in the feature branch.
git status
```
```bash
On branch feature/ai-chatbot
nothing to commit, working tree clean
```

### Moving back to the main branch [For practice]

```bash
cd ../mr-level-05-fsd-mission-03-ai-interview-chatbot
git status
```

```bash
On branch master
Your branch is up to date with 'origin/master'.
nothing to commit, working tree clean
```

### Moving back to the feature branch [For practice]

```bash
cd ../ai-chatbot
git status
```

```bash
On branch feature/ai-chatbot
nothing to commit, working tree clean
```

### Pushing from a branch 

- HEAD is the current branch
- this will cause this local brach to track the remote branch

```bash
git push -u origin HEAD
```

### Pull from the origin.

- Git now knows where to pull from because we setup tracking. You don't have to tell it anything.
- Once we pull we have a local repo. that is a copy of the remote repo.
- **We should do this** 
  - at the start of every coding session
  - prior to a push, to make sure we integrate changes from the remote repo
    - we may need to resolve any merge issues locally (if we have been making changes to the same files).

```bash
git pull
```

---

### Set-up local dev environment [really important]

#### Make sure you are in the right branch

```bash
cd [your_local_path]/ai-chat
git status
```

```bash
On branch feature/ai-chatbot
nothing to commit, working tree clean
```

#### Make sure you are upto date

- resolve any conflicts [ask for help if not sure, how to do this.]

```bash
git pull
```

#### Install node modules [these will not be in the repo]

```bash
npm install [just in case package.json has been updated
npm install -D jest [this should already be installed, this is just to make sure]
```

#### Check you have a .gitignore to exclude 'node_modules/' and '.env' at minimum

```bash
[windows]
type .gitignore
```

```bash
[mac/linux]
cat .gitignore
```

- Create .gitignore if missing.

```bash
[mac/linux]
touch .gitignore 
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore

[Windows CMD Prompt]
echo node_modules/ > .gitignore
echo .env > .gitignore
```

#### Check .env exists, and update with your Google Generative AI API key

```
[mac/linux]
cat .env

[windows]
type .env
```

- the file contents should be

```text
GEMINI_API_KEY="[YOUR_GOOGLE_GENAI_API_KEY]"
GEMINI_MODEL_NAME="gemini-1.5-flash"
```

- create the file if it dose not exist

```bash
[windows]
echo GEMINI_API_KEY="[YOUR_KEY]" > .env
echo GEMINI_MODEL_NAME="gemini-1.5-flash" > .env

```

---


## Useful Git Commands [please feel free to add to the list]


### Undo the last add

```bash
git reset
```

### Check branch and files in the commit

```bash
git status
```

# Undo and Redo a local commit that hasn't been pushed

```bash
git commit -m "Something terribly misguided"  [bad commit]
git reset HEAD~1 [undo last commit]
[ edit files as necessary ]
git add . [add again]
git commit -c ORIG_HEAD [redo commit with original message, but edited files]
[or]
git commit -m "A really good commit, replacing a bad one"
```
