"""Planning de publication Chrono Quiz : 3 épisodes par jour, un de chaque thème.

Jour 1 = DEBUT : épisodes 1 (foot), 2 (logique), 3 (culture) ; jour 2 : 4, 5, 6 ; etc.
Le premier soir, les 3 épisodes sortent à la suite (PREMIER_SOIR).
"""
import datetime as dt

DEBUT = dt.date(2026, 11, 23)
HEURES = {"foot": "12 h", "logique": "16 h", "culture": "20 h"}
PREMIER_SOIR = {"foot": "20 h", "logique": "21 h", "culture": "22 h"}


def horaire(numero, theme):
    """(date ISO, heure) de publication d'un épisode."""
    jour = (numero - 1) // 3
    date = DEBUT + dt.timedelta(days=jour)
    heure = (PREMIER_SOIR if jour == 0 else HEURES)[theme]
    return date.isoformat(), heure
