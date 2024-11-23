# CSS Cleaner

A CLI tool to clean duplicate CSS/SCSS properties, keeping the last occurrence.

## Installation

```bash
npm install --save-dev @aakashvaa/css-cleaner
```
---

### Project setup
```bash
{
  "scripts": {
    "clean": "css-cleaner src --recursive",
    "clean:fix": "css-cleaner src --recursive --fix"
  }
}
```
 ## You can optimise the cleaning process by giving the exact path of styles like :  src/styles
- src => It's the relative path from the project root where the css-cleaner script will run.
### Without Installing
```
{
  "scripts": {
    "clean": "npx @aakashvaa/css-cleaner src --recursive",
    "clean:fix": "npx @aakashvaa/css-cleaner src --recursive --fix"
  }
}

```

### **Using npm Scripts**

- **Check for duplicates**:
```bash
npm run clean
```

- **Fix duplicates**:
```bash
npm run clean:fix

```

---

### **Explanation:**

- **` clean `**:
  - Scans the `src` directory and all its subdirectories for `.css` and `.scss` files.
  - Logs duplicate CSS/SCSS properties without modifying the files.


- **` clean:fix `**:
  - Scans the `src` directory and its subdirectories for `.css` and `.scss` files.
  - Automatically removes duplicate properties and overwrites the files.
---

### **Using css cleaner manually**
```bash
css-cleaner <path-to-your-[.css/.scss] file>
```
- example : css-cleaner styles.css/styles.scss


### **Direct CLI Usage**

You can also run the tool directly if it’s installed globally:
- **check:**
```bash
css-cleaner <relative path to your styles> -r
```
- **fix:**
```bash
css-cleaner <relative path to your styles> -r --fix
```
---

## **Need Help?**

For detailed command options, use:
```
css-cleaner --help
```
