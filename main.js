// main.js

// Year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Your Firebase config (replace with your real values)
const firebaseConfig = {
  apiKey: "AIzaSyDuZ5oUomc-4QiRzU9WV1CE_OYvHX2ch3o",
  authDomain: "clueless-project-id.firebaseapp.com",
  projectId: "clueless-project-id",
  storageBucket: "clueless-project-id.appspot.com",
  messagingSenderId: "414737008695",
  appId: "1:414737008695:web:0a8f54297d2298e61197b2"
};

// Initialize Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// Utility
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const show = (el, msg) => { if (el) { el.textContent = msg || el.textContent; el.hidden = false; } };
const hide = (el) => { if (el) el.hidden = true; };

// Save email to Firestore
async function saveEmail(email) {
  await addDoc(collection(db, "waitlist"), {
    email,
    createdAt: serverTimestamp(),
    ua: navigator.userAgent || ""
  });
}

// Handle form submission
async function handleSubmit(e, inputId) {
  e.preventDefault();
  const input = document.getElementById(inputId);
  const email = (input?.value || "").trim();
  const errEl = document.getElementById('formError');
  const okEl  = document.getElementById('formSuccess');

  hide(errEl);
  hide(okEl);

  if (!emailRe.test(email)) {
    show(errEl, "Please enter a valid email.");
    return;
  }

  try {
    await saveEmail(email);
    if (input) input.value = "";
    show(okEl);
  } catch (err) {
    console.error(err);
    show(errEl, "Something went wrong. Please try again.");
  }
}

// Attach handlers
document.addEventListener("DOMContentLoaded", () => {
  const form1 = document.getElementById('waitlist');
  const form2 = document.getElementById('waitlist2');

  if (form1) form1.addEventListener("submit", (e) => handleSubmit(e, "email"));
  if (form2) form2.addEventListener("submit", (e) => handleSubmit(e, "email2"));
});
