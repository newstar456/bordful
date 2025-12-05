# Airtable Integration Notes for Bordfu

This document summarizes how Bordfu integrates with Airtable, the schema required, API calls, environment variables, and debugging notes.

---

## 1. Overview

Bordfu uses Airtable as its temporary database. All job records displayed in the UI come from an Airtable base, fetched through the Airtable REST API using an access token.

The integration is handled inside `lib/db/airtable.ts` and is used by UI pages such as `app/page.tsx`.

---

## 2. Required Airtable Setup

### **Base**

* You must create an Airtable Base.
* The table must be named: **Jobs** (based on the existing code).
* Each job record is one row.

### **Table Schema (Minimum Required Fields)**

Bordfu expects these fields:

* **Title** (single line text)
* **Slug** (single line text, unique)
* **Company** (single line text)
* **Location** (single line text)
* **Description** (long text)
* **URL** (URL)
* **Published** (checkbox / boolean)

> ⚠️ If fields are missing or named differently, API calls return empty arrays.

---

## 3. Environment Variables Needed

Create `.env.local` with:

```
AIRTABLE_TOKEN=your_pat_here
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Jobs
```

* **AIRTABLE_TOKEN:** Created in Airtable → Developer hub → Personal Access Tokens
* **AIRTABLE_BASE_ID:** Found in API docs for your base
* **AIRTABLE_TABLE_NAME:** Must match the Airtable table exactly → "Jobs"

### **Verify values**

Run inside `airtable.ts`:

```
console.log("token?", process.env.AIRTABLE_TOKEN);
console.log("base?", process.env.AIRTABLE_BASE_ID);
console.log("table?", process.env.AIRTABLE_TABLE_NAME);
```

This helps confirm environment variables are loaded.

---

## 4. API Calls Used by Bordfu

The main function exposed is:

### **getJobs()**

Located in: `lib/db/airtable.ts`

It performs:

* GET request to `https://api.airtable.com/v0/{baseId}/{tableName}`
* Filters only records where `Published = true`
* Maps Airtable fields to the UI-friendly job structure

If the API call fails → logs an error and returns an empty array.

---

## 5. Debugging Airtable Connection

### **Step-by-step checklist**

1. **Test token manually:**
   Run in terminal:

```
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.airtable.com/v0/YOUR_BASE_ID
```

2. **Ensure fields match exactly**

* Airtable is case-sensitive.
* Field `Published` must be boolean.

3. **Check the Next.js server logs**
   Run:

```
npm run dev
```

Look for:

* token logs
* baseId logs
* network fails

4. **Test from `airtable.ts`**
   Insert:

```
console.log("Fetching jobs from Airtable...");
```

5. **Add a fake record** in Airtable to test output.

---

## 6. Bordfu UI Integration Points

### **Used in:**

* `app/page.tsx` → loads jobs on homepage using **getJobs()**
* `app/api/og/jobs/[slug]/route.tsx` → generates OG images for job details
* `components/home/HomePage.tsx` → renders job cards

### **Data Flow**

**Airtable → airtable.ts → getJobs() → page.tsx → UI components**

---

## 7. Common Problems & Fixes

### **Problem: Empty array returned**

* Wrong table name → must be **Jobs**
* Wrong base ID → check API docs
* Invalid token → ensure correct PAT format
* Missing fields
* Missing `Published = true`

### **Problem: 404 on /api routes**

* Next.js route files must be named `route.ts` (not `.tsx`)
* Folder structure must match `/app/api/...`

---

## 8. Next Steps for Day 2

1. Verify Airtable schema
2. Test API calls manually and in Next.js
3. Document each endpoint (add later if needed)
4. Confirm jobs appear in console
5. Try rendering jobs in the UI

---

If you want, I can also create:

* diagrams
* API documentation
* schema table
* sample fake dataset for Airtable
