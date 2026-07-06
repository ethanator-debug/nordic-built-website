NORDIC BUILT — WEBSITE + CONTACT-FORM CRM
===========================================

7 pages, built from the Nordic Built rebrand storyboard:
  index.html     Home
  about.html     Our Story (heritage, values, the mark)
  services.html  Craftsmanship & Services
  mission.html   Mission, Vision & Giving Back
  gallery.html   Our Work (project photos)
  contact.html   Contact form + info
  crm.html       Private leads dashboard (not linked in the public nav)

Shared assets:
  css/style.css   all styling
  js/main.js      mobile nav, gallery filter, contact form submission
  assets/         logo files, favicon, and your project photos
  api/            Vercel serverless functions (contact form + leads)
  db/schema.sql   the one database table this site needs

This folder has everything Vercel needs: package.json, vercel.json,
.vercelignore, and .env.example. Upload it to GitHub, then import it
into Vercel — steps below.


1. UPLOAD TO GITHUB (using the "uploading an existing file" button)
------------------------------------------------------------------
  1. Create a new, empty repository at github.com/new (don't check
     "Add a README file" or add a .gitignore/license — this folder
     already has everything it needs).
  2. On the new repo's page, click "uploading an existing file".
  3. IMPORTANT — some files in this folder start with a dot (.gitignore,
     .vercelignore, .env.example) and are hidden by default in Finder.
     Before dragging the folder contents in, press Cmd+Shift+. in
     Finder to reveal them, so they get included in the upload. All
     three matter: without .vercelignore and .gitignore, nothing
     breaks the live site, but without them extra files (like this
     README) would end up publicly deployed alongside the real pages.
  4. Select ALL files and folders directly inside this "Nordic Built
     website" folder (index.html, about.html, css/, js/, assets/,
     api/, db/, package.json, vercel.json, .gitignore, .vercelignore,
     .env.example, README.txt — everything at the top level) and drag
     them onto the GitHub upload page. Drag the CONTENTS of the
     folder, not the folder itself, or GitHub will nest everything
     one level deep (e.g. nordic-built-website/index.html instead of
     index.html) and Vercel won't find index.html or the api/ folder
     at the project root.
  5. Scroll down and click "Commit changes".

Double-check afterward: click into api/ on GitHub and confirm both
contact.js and leads.js are there — these two are the most important
files to get right, since the contact form and CRM depend on them.

(For any edits after this first upload, see section 6 — same "Add
file > Upload files" button, just dragging in the changed file(s).)


2. IMPORT INTO VERCEL
-------------------------
  1. Go to vercel.com/new and import the GitHub repo you just pushed.
  2. Vercel auto-detects the api/ functions and static pages — no
     build settings to configure.
  3. Don't click Deploy yet — set up the database first (step 3
     below) so the environment variables are ready before the first
     deploy.


3. DATABASE — NEON POSTGRES
-----------------------------
  1. Create a free project at neon.tech.
  2. In the Neon dashboard, open the SQL Editor, paste in the entire
     contents of db/schema.sql, and run it. This creates the "leads"
     table that stores every contact-form submission.
  3. Copy the pooled connection string from Neon's "Connection
     Details" panel (starts with postgresql://...).


4. ENVIRONMENT VARIABLES (Vercel Project Settings > Environment Variables)
----------------------------------------------------------------------------
  DATABASE_URL   the Neon connection string from step 3
  ADMIN_KEY      a password you make up — protects /crm.html

  (.env.example in this folder shows the format. Never commit a real
  .env file — only .env.example, which has placeholder values.)

Once both variables are set, click Deploy. The contact form on
contact.html will start saving submissions into Neon automatically.


5. VIEWING YOUR LEADS (THE CRM)
----------------------------------
Visit yoursite.com/crm.html, enter the ADMIN_KEY you set in step 4,
and you'll see every submission — name, email, phone, project type,
message, and date — newest first. You can delete a row or export
everything to CSV. This page is intentionally left out of the public
nav menu; only people with the link and the key can reach it.


6. MAKING CHANGES AFTER LAUNCH
----------------------------------
Two ways to make a change stick:
  1. Ask me to make the edit any time (copy, layout, new pages, new
     gallery photos, dropdown options, etc.) — I'll update the files
     in this folder, and you re-upload just the changed file(s)
     through GitHub's "Add file > Upload files" button (same as the
     first upload — it overwrites files at the same path).
  2. Or edit a file yourself directly on GitHub (click the file, then
     the pencil/edit icon) for small text changes.

Either way, once GitHub has the change, Vercel automatically
redeploys within about a minute — no re-import, no manual Vercel
steps needed.

If you'd rather use git and the command line for this instead of the
web upload button going forward, just ask — it's easy to turn this
folder back into a git repo at any point.


7. ADDING YOUR OWN PROJECT PHOTOS
------------------------------------
Every "photo" section on the site (the split-image blocks on the
Home/Story/Mission pages, and the 9 tiles on gallery.html) already has
a spot reserved for a real photo. Right now they show styled color
placeholders because no photos exist yet — nothing is broken.

To add a photo: save it with the EXACT filename listed in
  assets/images/PUT_PHOTOS_HERE.txt
  assets/images/gallery/PUT_PHOTOS_HERE.txt
into that folder. The page picks it up automatically — no code edit
needed.

To replace a photo: overwrite the file with a new one using the same
filename.

To remove a photo: delete the file. The tile reverts to its styled
placeholder automatically.

To add a brand-new gallery project (a new tile, not just a new photo
for an existing one) or reorganize the gallery: just ask — that's a
quick HTML edit rather than a file swap.


8. PROJECT TYPE DROPDOWN (contact.html)
-------------------------------------------
Options are: Custom Cabinetry, Millwork & Trim, Built-Ins, Kitchen /
Bath Remodel, Commercial Millwork, Charity, Other. Add or remove
options directly in the <select id="project"> block in contact.html.


BEFORE YOU LAUNCH — REMAINING PLACEHOLDERS
----------------------------------------------
  - Phone: 615-491-4055
  - Email: nordiccraftsman@live.com
  - Social links (Instagram/Facebook) in each footer
  - Map block on contact.html — swap for a real embedded map
  - Real photos (see section 7 above)

Fonts load from Google Fonts (Cormorant Garamond + Inter) via CDN —
no local font files needed.
