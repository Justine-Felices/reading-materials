# Project E-READ — Teacher Manual  
**Maugat East Elementary School**

This guide explains how to use the Project E-READ website: how students find reading materials, and how teachers add, edit, or remove them.

---

## 1. What is Project E-READ?

Project E-READ is a digital reading site for the school.

| Who | What they do |
|-----|----------------|
| **Students** | Browse materials by grade, subject, week, and level; read online; download |
| **Teachers** | Log in once, then upload and manage materials for the whole school |

Materials you save with **Cloud sync on** are available to all students (not only on your computer).

---

## 2. Website links

| Page | Address |
|------|---------|
| **Home (students)** | [https://reading-materials.vercel.app/](https://reading-materials.vercel.app/) |
| **Reading materials** | [https://reading-materials.vercel.app/reading-materials](https://reading-materials.vercel.app/reading-materials) |
| **Teacher login** | [https://reading-materials.vercel.app/teacher/login](https://reading-materials.vercel.app/teacher/login) |

> Tip: Bookmark the **Teacher login** page on the school computer or your phone.

---

## 3. For students (quick overview)

Students do **not** need a password.

1. Open the website home page.
2. Tap **Explore Reading Materials** (or go to Reading Materials).
3. Choose a grade: **Kinder**, or **Grade 1–6**.
4. Choose a subject: **English**, **Filipino**, **Math**, or **Science**.
5. Open a **Week** (accordion) to see materials.
6. Materials are grouped by **Level 1**, **Level 2**, and **Level 3**.
7. Tap **Read Material** to open the reader, or **Download** to save a file.

On phones, grade and subject cards can be **swiped sideways**. Weeks stay closed until the student opens one.

---

## 4. Teacher login

There is **one shared teacher account** for this project (no self-signup).

1. Go to: [https://reading-materials.vercel.app/teacher/login](https://reading-materials.vercel.app/teacher/login)
2. Enter the school teacher email and password (ask Justine Felices if you do not have them).
3. Tap **Sign in**.
4. You will land on **Manage Reading Materials**.

### Sign out

On the manage page, tap **Log out** when you are finished—especially on a shared computer.

### Login tips

- Wrong email or password → you will see an error. Double-check spelling and caps lock.
- If the page says login is not configured, contact the person who set up the website.
- Stay signed in only on trusted devices.

---

## 5. Manage Reading Materials (teacher page)

After login you see two main parts:

1. **Add material / Edit material** — the form on the left (or top on phones)
2. **All materials** — the list of everything already uploaded

Look for **Cloud sync on** near the top. That means saves go to the school cloud database and students can see them.

---

## 6. How to add a new material

1. Make sure you are on **Add material** (not editing an old one).
2. Fill in:

| Field | What to enter |
|-------|----------------|
| **Title** | Clear name students will see (e.g. *Facts About the Sun*) |
| **Description** | Short summary |
| **Grade** | Kinder or Grade 1–6 |
| **Week** | Week number for your lesson plan (e.g. 1–10) |
| **Level** | 1, 2, or 3 (difficulty / set) |
| **Subject** | English, Filipino, Math, or Science |
| **Pages / files** | At least one image or PDF (required) |

3. For each page:
   - Use **Attach** to choose a file from your computer or phone, **or**
   - Paste a valid image/PDF link if you already have one online.
4. You can add more pages with **Add page**.
5. Tap **Save material**.

### Allowed files

- Images: JPG, PNG, WebP, GIF  
- Documents: PDF  
- Max size: about **20 MB** per file  

### After saving

- A success message appears.
- The material shows in **All materials**.
- Students can find it under that grade → subject → week → level.

---

## 7. Important rule: one material per slot

Each combination of **Grade + Week + Level + Subject** can have only **one** material.

Example: *Grade 6 · Week 2 · Level 1 · Science* — only one entry.

If you save another for the same slot, a popup asks:

- **Replace it** — overwrites the old material with the new one  
- **Keep existing** — cancels; the old material stays  

Choose carefully. Replacing removes the previous content for that slot.

---

## 8. How to edit a material

1. In **All materials**, find the item (use search or filters if needed).
2. Tap **Edit**.
3. Change the title, description, grade, week, level, subject, or files.
4. Tap **Save material**.
5. To stop editing without saving, tap **Cancel edit**. If you made changes, confirm whether to discard them.

---

## 9. How to delete a material

1. Find the material in **All materials**.
2. Tap **Delete**.
3. Confirm when asked.

Deleted materials are removed for students as well (when cloud sync is on).

---

## 10. Using the reader (what students see)

When someone opens a material:

- Use arrows or buttons to go to the **previous / next** page.
- **Zoom** in or out if needed.
- **Download** saves the file when available.
- **Fullscreen / maximize** enlarges the reader (on some phones it fills the screen; tap again to exit).

---

## 11. Suggested classroom workflow

1. Plan: pick **grade**, **subject**, **week**, and **level**.
2. Prepare the PDF or images (clear photos, readable text).
3. Log in as teacher → **Add material**.
4. Save and check **Cloud sync on**.
5. Open the student site on another device or phone and verify:
   - Correct grade and subject  
   - Correct week accordion  
   - Correct level column  
   - File opens and pages turn correctly  

---

## 12. Troubleshooting

| Problem | What to try |
|---------|-------------|
| Cannot log in | Check email/password; ask admin for the single teacher account |
| “Bucket not found” / upload fails | Ask admin to check Supabase Storage (`reading-files` bucket) |
| Students don’t see new material | Confirm **Cloud sync on**; refresh the student page; check grade/subject/week/level |
| Wrong material for a slot | Edit it, or replace when the conflict popup appears |
| File too large | Compress the PDF/image or split into smaller pages |
| Page won’t open on phone | Use Wi‑Fi; try another browser; make sure the file is a normal PDF or image |
| Still signed in on school PC | Always tap **Log out** when done |

---

## 13. Privacy & account notes

- Do **not** share the teacher password with students.
- Do **not** post the password in group chats or printed notices on the wall.
- Only the school’s one teacher account can upload or delete materials.
- Students never need that account.

---

## 14. Need help?

Contact the person who maintains Project E-READ for this school:

- **Name:** Justine Felices  
- **Website:** [www.justinefelices.dev](https://www.justinefelices.dev)  

---

*Project E-READ · Maugat East Elementary School*  
*Teacher Manual*  
*Live site: [https://reading-materials.vercel.app/](https://reading-materials.vercel.app/)*
