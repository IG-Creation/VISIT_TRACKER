"""Branch, State, and Cluster hierarchy data provided for Visit Tracker."""

RAW_BRANCH_DATA = """Branch Name,Branch State,Branch Cluster
Begusarai,Bihar,Muzaffarpur Cluster
Motihari,Bihar,Muzaffarpur Cluster
Darbhanga,Bihar,Muzaffarpur Cluster
Gaya,Bihar,Patna Cluster
Gopalganj,Bihar,Gopalganj Cluster
Patna,Bihar,Patna Cluster
Chhapra,Bihar,Gopalganj Cluster
Aurangabad,Bihar,Patna Cluster
Bhagalpur,Bihar,Patna Cluster
Sitamarhi,Bihar,Gopalganj Cluster
Sasaram,Bihar,Patna Cluster
Delhi- Uttam Nagar,Delhi,Delhi 1 Cluster
Burari,Delhi,Delhi 2 Cluster
Krishna Nagar-Delhi,Delhi,Delhi 1 Cluster
Rajkot,Gujarat,Ahmedabad Cluster
Ahmedabad,Gujarat,Ahmedabad Cluster
Vadodara,Gujarat,Ahmedabad Cluster
Surat,Gujarat,Ahmedabad Cluster
Bhavnagar,Gujarat,Ahmedabad Cluster
Faridabad Nit,Haryana,Faridabad Cluster
Karnal/074B01,Haryana,Karnal Cluster
Rewari,Haryana,Faridabad Cluster
Rohtak,Haryana,Karnal Cluster
Hisar,Haryana,Karnal Cluster
Yamuna Nagar,Uttar Pradesh - 1,Saharanpur Cluster
Sirsa,Haryana,Karnal Cluster
Gwalior,Uttar Pradesh - 2,Gwalior Cluster
Indore,Madhya Pradesh,Indore Cluster
Ujjain,Madhya Pradesh,Indore Cluster
Vidisha,Madhya Pradesh,Indore Cluster
Shivpuri,Uttar Pradesh - 2,Gwalior Cluster
Sagar,Madhya Pradesh,Indore Cluster
Dewas,Madhya Pradesh,Indore Cluster
Dhar,Madhya Pradesh,Indore Cluster
Ajmer,Rajasthan,Ajmer Cluster
Jodhpur,Rajasthan,Jodhpur Cluster
Alwar,Rajasthan,Sikar Cluster
Udaipur,Rajasthan,Jodhpur Cluster
Bhilwara,Rajasthan,Jodhpur Cluster
Neemkathana,Rajasthan,Sikar Cluster
Jalore,Rajasthan,Jodhpur Cluster
Bharatpur,Uttar Pradesh - 2,Agra Cluster
Jhunjhunu,Rajasthan,Sikar Cluster
Jaipur,Rajasthan,Ajmer Cluster
Jhansi/166B01,Uttar Pradesh - 2,Gwalior Cluster
Agra,Uttar Pradesh - 2,Agra Cluster
Noida,Haryana,Delhi 2 Cluster
Lucknow,Uttar Pradesh - 3,Sangam Cluster
Varanasi,Uttar Pradesh - 3,Sangam Cluster
Prayagraj,Uttar Pradesh - 3,Sangam Cluster
Bareilly,Uttar Pradesh - 1,Bareilly Cluster
Mathura,Uttar Pradesh - 2,Agra Cluster
Saharanpur,Uttar Pradesh - 1,Saharanpur Cluster
Aligarh,Uttar Pradesh - 1,Aligarh Cluster
Ayodhya,Uttar Pradesh - 3,Sangam Cluster
Gorakhpur,Uttar Pradesh - 3,Purvanchal Cluster
Azamgarh,Uttar Pradesh - 3,Purvanchal Cluster
Bulandshahr,Uttar Pradesh - 1,Bareilly Cluster
Jaunpur,Uttar Pradesh - 3,Purvanchal Cluster
Kanpur,Uttar Pradesh - 3,Sangam Cluster
Deoria,Uttar Pradesh - 3,Purvanchal Cluster
Basti,Uttar Pradesh - 3,Purvanchal Cluster
Bijnor,Uttar Pradesh - 1,Saharanpur Cluster
Firozabad,Uttar Pradesh - 2,Agra Cluster
Orai,Uttar Pradesh - 2,Gwalior Cluster
Meerut,Uttar Pradesh - 1,Saharanpur Cluster
Farrukhabad,Uttar Pradesh - 2,Agra Cluster
Kasganj,Uttar Pradesh - 1,Aligarh Cluster
Kashipur,Uttar Pradesh - 1,Bareilly Cluster
Roorkee,Uttar Pradesh - 1,Saharanpur Cluster
Haldwani,Uttar Pradesh - 1,Bareilly Cluster
Badaun,Uttar Pradesh - 1,Aligarh Cluster
Muzaffarpur,Bihar,Muzaffarpur Cluster
Samastipur,Bihar,Patna Cluster
Moradabad,Uttar Pradesh - 1,Bareilly Cluster
Chandausi,Uttar Pradesh - 1,Aligarh Cluster
Sikar,Rajasthan,Sikar Cluster
Nagaur,Rajasthan,Ajmer Cluster
Didwana,Rajasthan,Ajmer Cluster
Kuchaman,Rajasthan,Ajmer Cluster
Shahjahanpur,Uttar Pradesh - 1,Bareilly Cluster
Balotra,Rajasthan,Jodhpur Cluster
Bijainagar,Rajasthan,Ajmer Cluster
Bandikui,Rajasthan,Sikar Cluster
Bettiah,Bihar,Gopalganj Cluster
Madhubani,Bihar,Muzaffarpur Cluster"""

import csv
import io
from typing import Dict, List, Any


def get_hierarchy() -> Dict[str, Any]:
    """Parse raw branch data and return structured hierarchy including Head Office."""
    f = io.StringIO(RAW_BRANCH_DATA.strip())
    reader = csv.DictReader(f)

    # Structure:
    # {
    #   "states": ["Head Office", "Bihar", ...],
    #   "hierarchy": {
    #      "Head Office": { "Head Office": ["Head Office"] },
    #      "Bihar": { "Muzaffarpur Cluster": ["Begusarai", ...], ... }
    #   },
    #   "raw_records": [ {branch, state, cluster}, ... ]
    # }

    hierarchy: Dict[str, Dict[str, List[str]]] = {
        "Head Office": {
            "Head Office": ["Head Office"]
        }
    }
    raw_records = [
        {"branch_name": "Head Office", "branch_state": "Head Office", "branch_cluster": "Head Office"}
    ]

    for row in reader:
        state = row["Branch State"].strip()
        cluster = row["Branch Cluster"].strip()
        branch = row["Branch Name"].strip()

        raw_records.append({
            "branch_name": branch,
            "branch_state": state,
            "branch_cluster": cluster
        })

        if state not in hierarchy:
            hierarchy[state] = {}
        if cluster not in hierarchy[state]:
            hierarchy[state][cluster] = []
        if branch not in hierarchy[state][cluster]:
            hierarchy[state][cluster].append(branch)

    # Sort keys for consistent UX
    sorted_states = ["Head Office"] + sorted([s for s in hierarchy.keys() if s != "Head Office"])

    return {
        "states": sorted_states,
        "hierarchy": hierarchy,
        "raw_records": raw_records
    }
