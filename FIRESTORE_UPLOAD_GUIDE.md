# Firestore PG Upload Guide

## Quick Steps to Upload 6 PGs to Firebase Firestore

### Step 1: Open Firebase Console
Go to: https://console.firebase.google.com/project/pg-walebhaiya/firestore/databases/-default-/data

### Step 2: Create `pgs` Collection
- If you don't see a `pgs` collection, click **"Start collection"**
- Collection ID: `pgs`
- Click **"Next"**

### Step 3: Add Each PG Document

For each of the 6 PGs below, add a document:

---

#### **Document 1: green-valley-pg**

**Document ID:** `green-valley-pg`

**Fields to add:**

```
name: "Green Valley PG" (string)
title: "Green Valley PG" (string)
price: 8000 (number)
monthlyRent: 8000 (number)
rating: 4.5 (number)
reviews: 127 (number)
gender: "Boys" (string)
roomType: "Double Sharing" (string)
distance: "0.5 km from LPU" (string)
area: "Phagwara" (string)
image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800" (string)
food: "Included (Veg & Non-Veg)" (string)
description: "Modern PG accommodation with all essential amenities, located conveniently near LPU campus." (string)
availableFrom: "2024-01-15T00:00:00Z" (string)
featured: true (boolean)
verified: true (boolean)
status: "approved" (string)
landlordId: "landlord-001" (string)
createdAt: November 15, 2024 at 12:00:00 AM UTC (timestamp)
updatedAt: November 15, 2024 at 12:00:00 AM UTC (timestamp)

location: (map)
  address: "Near LPU Gate 3, Phagwara" (string)
  city: "Phagwara" (string)
  state: "Punjab" (string)
  pincode: "144411" (string)
  coordinates: (map)
    lat: 31.252 (number)
    lng: 75.705 (number)

contact: (map)
  phone: "+91 98765 43210" (string)
  email: "greenvalley@example.com" (string)
  whatsapp: "+91 98765 43210" (string)

amenities: (array)
  0: "WiFi" (string)
  1: "AC" (string)
  2: "Mess" (string)
  3: "Laundry" (string)
  4: "Security" (string)
  5: "Power Backup" (string)

images: (array)
  0: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800" (string)
  1: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800" (string)
  2: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800" (string)

rules: (array)
  0: "No smoking inside premises" (string)
  1: "Visitors allowed till 9 PM" (string)
  2: "Monthly rent to be paid before 5th" (string)

nearbyPlaces: (array - each item is a map)
  0: (map)
    name: "LPU Gate 3" (string)
    distance: "0.5 km" (string)
  1: (map)
    name: "Medical Store" (string)
    distance: "0.2 km" (string)
  2: (map)
    name: "ATM" (string)
    distance: "0.3 km" (string)
```

---

#### **Document 2: sunshine-residency**

**Document ID:** `sunshine-residency`

**Fields:**
```
name: "Sunshine Residency"
title: "Sunshine Residency"
price: 6500
monthlyRent: 6500
rating: 4.3
reviews: 89
gender: "Girls"
roomType: "Triple Sharing"
distance: "1.2 km from LPU"
area: "Phagwara"
image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"
food: "Included (Pure Veg)"
description: "Comfortable and safe accommodation for female students with homely environment."
availableFrom: "2024-02-01T00:00:00Z"
featured: true
verified: true
status: "approved"
landlordId: "landlord-002"
createdAt: January 5, 2024
updatedAt: January 5, 2024

location: (map)
  address: "Sector 15, Near City Mall, Phagwara"
  city: "Phagwara"
  state: "Punjab"
  pincode: "144401"
  coordinates: (map)
    lat: 31.234
    lng: 75.712

contact: (map)
  phone: "+91 98765 43211"
  email: "sunshine@example.com"
  whatsapp: "+91 98765 43211"

amenities: ["WiFi", "Mess", "Laundry", "Security", "Study Room", "Common Area"]
images: [3 image URLs - see JSON file]
rules: ["No male visitors", "Curfew at 10 PM", "No outside food allowed"]
nearbyPlaces: [City Mall, Bus Stand, Hospital - with distances]
```

---

#### **Document 3: campus-comfort-pg**

**Document ID:** `campus-comfort-pg`

**Key fields:**
- name: "Campus Comfort PG"
- price: 7500
- rating: 4.6
- reviews: 156
- gender: "Boys"
- roomType: "Single Sharing"
- featured: true
- status: "approved"
- landlordId: "landlord-003"

(Copy structure from Documents 1 & 2)

---

#### **Document 4: elite-student-pg**

**Document ID:** `elite-student-pg`

**Key fields:**
- name: "Elite Student PG"
- price: 5500
- rating: 4.2
- gender: "Boys"
- roomType: "Four Sharing"
- featured: false
- status: "approved"

---

#### **Document 5: royal-pg**

**Document ID:** `royal-pg`

**Key fields:**
- name: "Royal PG"
- price: 9000
- rating: 4.7
- gender: "Girls"
- roomType: "Double Sharing"
- featured: false
- status: "approved"

---

#### **Document 6: haven-residency**

**Document ID:** `haven-residency`

**Key fields:**
- name: "Haven Residency"
- price: 7000
- rating: 4.4
- gender: "Boys"
- roomType: "Triple Sharing"
- featured: false
- status: "approved"

---

## Complete JSON Data

For exact field values, refer to `pgs-import-data.json` in the project root.

## After Upload

1. Verify in Firebase Console that all 6 documents appear in the `pgs` collection
2. Test the frontend: Your homepage and listings page should now load PGs from Firestore
3. The frontend has fallback to static data, so it will work either way

## Tips

- Use Firebase Console's "Auto-ID" feature and then change it to the custom ID
- For timestamps, use the built-in timestamp selector
- For maps (nested objects), click "Add field" → Type: "map"
- For arrays, click "Add field" → Type: "array"

---

**Estimated time:** 5-10 minutes to add all 6 documents
