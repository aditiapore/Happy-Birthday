# 🚀 Step-by-Step GitHub Pages Deployment Guide

This guide will show you exactly how to upload your gorgeous birthday website online for **Sajal** for free! 

Since you are on Windows, we have laid out the two easiest options: **Option A** (simple visual drag-and-drop in the browser—no tools or commands required!) and **Option B** (using Git commands in your terminal).

---

## 🎨 Before You Upload: Check Your Assets
Make sure you have your assets ready in your `j:\Python\Bithday` folder:
1. **Your Background & Polaroid Photos**: Ensure you have `photo1.jpeg`, `photo2.jpeg`, `photo3.jpeg`, `photo4.jpeg`, and `photo5.jpeg` in your main folder.
2. **Your Romantic Background Music**: Keep your background song `romantic_bg.mp3` in the main folder as well.
3. *Note*: The website is programmed to automatically use these files first!

---

## ⭐️ Option A: The Simple Visual Way (Highly Recommended!)
This is the easiest way to get your website online in under 3 minutes, using just your web browser. No software installation needed!

### Step 1: Create a GitHub Account
1. Open your browser and go to [github.com](https://github.com).
2. If you don't have an account, click **Sign up** and create a free account. Otherwise, **Sign in**.

### Step 2: Create a New Repository
1. On your GitHub homepage (or by clicking the `+` icon in the top right), click **New repository** (or click the green **New** button).
2. **Repository name**: Type `birthday` (or something similar like `sajal-birthday`).
3. **Description** (optional): `Surprise website for Sajal Patil ❤️`.
4. **Visibility**: Select **Public** (this is *required* to use the free GitHub Pages feature).
5. Leave all other settings at their defaults (don't add a README, gitignore, or license).
6. Click the green **Create repository** button at the bottom.

### Step 3: Drag & Drop Your Files
1. On the page that appears, look for the text: *"Get started by creating a new file or uploading an existing file."*
2. Click the link that says **"uploading an existing file"**.
3. Open your Windows File Explorer and navigate to your folder: `j:\Python\Bithday`.
4. Select **all the files** in this folder:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `config.js`
   - `photo1.jpeg`, `photo2.jpeg`, `photo3.jpeg`, `photo4.jpeg`, `photo5.jpeg`
   - `romantic_bg.mp3`
   - `GITHUB_GUIDE.md`
5. **Drag and drop** all these files together directly into the big box on the GitHub page in your browser.
6. Wait a minute for the files to finish loading (a green bar will progress for each file).
7. Scroll down to **Commit changes**, type `Upload surprise site` in the title box, and click the green **Commit changes** button.

### Step 4: Enable GitHub Pages (Launch your site!)
1. In your repository on GitHub, look at the menu tabs at the very top (Code, Issues, Pull Requests... Settings). Click **Settings** (the gear icon).
2. In the left-hand sidebar, scroll down to the **Code and automation** section and click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Set to **Deploy from a branch**.
   - **Branch**: Click the dropdown (currently says *None*) and select **`main`** (or `master`).
   - **Folder**: Keep it as **`/ (root)`**.
4. Click the **Save** button.
5. Wait about 30 to 60 seconds.
6. Refresh the page. You will see a blue banner appear at the top of the *GitHub Pages* settings screen saying:
   > **Your site is live at `https://yourusername.github.io/birthday/`**
7. Click that link to open your live website! You can copy and send this URL to Sajal on his birthday! 🥳

---

## 💻 Option B: Using Git Commands (Terminal Way)
If you prefer using the command line and already have Git installed on your Windows system, follow these commands in PowerShell or Command Prompt inside your project directory:

### Step 1: Initialize Git & Commit
Open your shell, go to your project folder, and run:
```powershell
# Initialize git repository
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "feat: once upon a birthday starlight gold theme"
```

### Step 2: Connect to GitHub & Push
1. Create a **New Repository** on [github.com](https://github.com) named `birthday` (set to **Public**), keeping it completely empty.
2. Copy the command lines shown on GitHub under *"or push an existing repository from the command line"*:
```powershell
# Rename default branch to main
git branch -M main

# Link your local folder to your remote GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/birthday.git

# Push your files to GitHub
git push -u origin main
```
*(Replace `YOUR_USERNAME` with your actual GitHub username!)*

### Step 3: Turn on GitHub Pages
1. Go to your repository on GitHub > click the **Settings** tab.
2. Click **Pages** in the left sidebar.
3. Select the **`main`** branch and click **Save**.
4. Your website link will be ready in 1 minute!

---

## 💡 How do I edit my messages or questions later?
If you ever want to change a quiz question, update your letter, or modify a photo caption *after* your site is live:
1. Open `config.js` on your computer, make your edits, and save the file.
2. Go to your repository on GitHub.
3. Click the `config.js` file, click the **pencil icon** in the top right to edit it, paste your updated code, and click **Commit changes**.
4. GitHub Pages will automatically update your live site within 1 minute!
