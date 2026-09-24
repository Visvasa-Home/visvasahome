# shared/localization.py

import json
from shared.utils import logger

# A simple dictionary for translations. In a real system, this could be backed by a DB or Redis.
TRANSLATIONS = {
    "hi": {
        "Instant": "तत्काल (Instant)",
        "ServicePackage": "सर्विस पैकेज",
        "Local": "स्थानीय",
        "Area - Pincode": "क्षेत्र - पिनकोड",
        "approx": "लगभग",
        "km": "किमी",
        "Booking Offered": "नई बुकिंग मिली है!",
    },
    "te": {
        "Instant": "తక్షణం (Instant)",
        "ServicePackage": "సేవా ప్యాకేజీ",
        "Local": "స్థానిక",
        "Area - Pincode": "ప్రాంతం - పిన్‌కోడ్",
        "approx": "సుమారు",
        "km": "కిమీ",
        "Booking Offered": "కొత్త బుకింగ్ ఆఫర్ చేయబడింది!",
    },
    # Default to English
    "en": {
        "Instant": "Instant",
        "ServicePackage": "Service Package",
        "Local": "Local",
        "Area - Pincode": "Area - Pincode",
        "approx": "approx",
        "km": "km",
        "Booking Offered": "New Booking Offered!",
    }
}

def translate(text: str, locale: str = "en") -> str:
    """
    Translates a given text to the target locale. 
    Falls back to English if the translation is missing.
    """
    if locale not in TRANSLATIONS:
        locale = "en"
        
    # Check if direct match exists
    if text in TRANSLATIONS[locale]:
        return TRANSLATIONS[locale][text]
        
    # Fallback to English direct match
    if text in TRANSLATIONS["en"]:
        return TRANSLATIONS["en"][text]
        
    # Attempt basic word replacement for dynamic strings (e.g., "approx 2.4 km")
    # This is a naive approach; a real system uses ICU message formats or gettext.
    translated_text = text
    for eng_word, loc_word in TRANSLATIONS[locale].items():
        if eng_word in text:
            translated_text = translated_text.replace(eng_word, loc_word)
            
    return translated_text

def format_currency(amount: float, locale: str = "en") -> str:
    """Formats currency based on locale (e.g. INR format for India)"""
    # Assuming INR for all for now, but could be localized
    return f"₹{int(amount)}"

def format_datetime(dt, locale: str = "en") -> str:
    """Formats datetime string based on locale (e.g. Wednesday, 05:00 PM)"""
    if not dt: return ""
    # Very basic naive translation of day names
    days_hi = {"Monday": "सोमवार", "Tuesday": "मंगलवार", "Wednesday": "बुधवार", "Thursday": "गुरुवार", "Friday": "शुक्रवार", "Saturday": "शनिवार", "Sunday": "रविवार"}
    days_te = {"Monday": "సోమవారం", "Tuesday": "మంగళవారం", "Wednesday": "బుధవారం", "Thursday": "గురువారం", "Friday": "శుక్రవారం", "Saturday": "శనివారం", "Sunday": "ఆదివారం"}
    
    formatted = dt.strftime("%A, %I:%M %p")
    day_name = dt.strftime("%A")
    
    if locale == "hi" and day_name in days_hi:
        formatted = formatted.replace(day_name, days_hi[day_name])
    elif locale == "te" and day_name in days_te:
        formatted = formatted.replace(day_name, days_te[day_name])
        
    return formatted
