# Sm-Global

SMM Global training tasks — Day 1 through Day 6 (and future days).

Repo: [github.com/sagartiwari-net/Sm-Global](https://github.com/sagartiwari-net/Sm-Global)

## Folder structure

```
SMM Global/
├── Day 1/
│   ├── task1/
│   └── task2/
├── Day 2/
│   ├── task1/
│   └── task2/
├── Day 3/
│   ├── task1/
│   └── task2/
├── Day 4/
│   └── task1/
├── Day 5/
│   └── task1/
└── Day6/
    └── task1/          ← Zomato clone (React + Redux Toolkit)
```

## Run a project (example: Day 6)

```bash
cd "Day6/task1"
npm install
npm run dev
```

## Upload new work to GitHub (future days)

From this folder (`SMM Global`):

```bash
# 1) See what changed
git status

# 2) Stage everything (respects .gitignore)
git add .

# 3) Commit
git commit -m "Add Day7 task1"

# 4) Push
git push
```

Or use the helper script:

```bash
./push.sh "Add Day7 task1"
```

## Notes

- `node_modules`, `dist`, `.env`, and `.DS_Store` are ignored — do not commit them.
- Keep new work as `Day N/taskX/` so the repo stays organized.
- One repo for all days makes history and reviews easier.
