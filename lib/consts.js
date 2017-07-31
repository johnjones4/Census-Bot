exports.columns = {
  'HRHHID': [1,15],
  'HETENURE': [29,30], //Bad data
  'HEHOUSUT': [31,32],
  'HETELHHD': [33,34],
  'HETELAVL': [35,36],
  'HEFAMINC': [39,40],
  'PRTAGE': [122,123],
  'PEMARITL': [125,126],
  'PESEX': [129,130],
  'PEAFEVER': [131,132],
  'PEEDUCA': [137,138],
  'PTDTRACE': [139,140],
  'PWSSWGT': [613,622]
};

exports.types = {
  'HRHHID': 'string',
  'HETENURE': 'int',
  'HEHOUSUT': 'int',
  'HETELHHD': 'int',
  'HETELAVL': 'int',
  'HEFAMINC': 'int',
  'PRTAGE': (value) => {
    const age = parseInt(value);
    if (age <= 79) {
      return {
        'MIN': age,
        'MAX': age
      };
    } else if (age === 80) {
      return {
        'MIN': 80,
        'MAX': 84
      };
    } else {
      return {
        'MIN': 85,
        'MAX': 1000
      };
    }
  },
  'PEMARITL': 'int',
  'PESEX': 'int',
  'PEAFEVER': 'int',
  'PEEDUCA': 'int',
  'PTDTRACE': 'int',
  'PWSSWGT': (value) => {
    const weight = parseInt(value);
    if (weight < 0) {
      return null;
    } else {
      return weight / 10000;
    }
  }
};

exports.values = {
  'HETENURE': {
    1: "OWNED OR BEING BOUGHT BY A HH MEMBER",
    2: "RENTED FOR CASH",
    3: "OCCUPIED WITHOUT PAYMENT OF CASH RENT"
  },
  'HEHOUSUT': {
    0: "OTHER UNIT",
    1: "HOUSE, APARTMENT, FLAT",
    2: "HU IN NONTRANSIENT HOTEL, MOTEL, ETC.",
    3: "HU PERMANENT IN TRANSIENT HOTEL, MOTEL",
    4: "HU IN ROOMING HOUSE",
    5: "MOBILE HOME OR TRAILER W/NO PERM. ROOM ADDED",
    6: "MOBILE HOME OR TRAILER W/1 OR MORE PERM. ROOMS ADDED",
    7: "HU NOT SPECIFIED ABOVE",
    8: "QUARTERS NOT HU IN ROOMING OR BRDING HS",
    9: "UNIT NOT PERM. IN TRANSIENT HOTL, MOTL",
    10: "UNOCCUPIED TENT SITE OR TRLR SITE",
    11: "STUDENT QUARTERS IN COLLEGE DORM",
    12: "OTHER UNIT NOT SPECIFIED ABOVE",
  },
  'HETELHHD': {
    1: "YES",
    2: "NO",
  },
  'HETELAVL': {
    1: "YES",
    2: "NO",
  },
  'HEFAMINC': {
    1: "LESS THAN $5,000",
    2: "5,000 TO 7,499",
    3: "7,500 TO 9,999",
    4: "10,000 TO 12,499",
    5: "12,500 TO 14,999",
    6: "15,000 TO 19,999",
    7: "20,000 TO 24,999",
    8: "25,000 TO 29,999",
    9: "30,000 TO 34,999",
    10: "35,000 TO 39,999",
    11: "40,000 TO 49,999",
    12: "50,000 TO 59,999",
    13: "60,000 TO 74,999",
    14: "75,000 TO 99,999",
    15: "100,000 TO 149,999",
    16: "150,000 OR MORE",
  },
  'PEMARITL': {
    1: "MARRIED - SPOUSE PRESENT",
    2: "MARRIED - SPOUSE ABSENT",
    3: "WIDOWED",
    4: "DIVORCED",
    5: "SEPARATED",
    6: "NEVER MARRIED",
  },
  'PESEX': {
    1: "MALE",
    2: "FEMALE",
  },
  'PEAFEVER': {
    1: "YES",
    2: "NO",
  },
  'PEEDUCA': {
    31: "LESS THAN 1ST GRADE",
    32: "1ST, 2ND, 3RD OR 4TH GRADE",
    33: "5TH OR 6TH GRADE",
    34: "7TH OR 8TH GRADE",
    35: "9TH GRADE",
    36: "10TH GRADE",
    37: "11TH GRADE",
    38: "12TH GRADE NO DIPLOMA",
    39: "HIGH SCHOOL GRAD-DIPLOMA OR EQUIV (GED)",
    40: "SOME COLLEGE BUT NO DEGREE",
    41: "ASSOCIATE DEGREE-OCCUPATIONAL/VOCATIONAL",
    42: "ASSOCIATE DEGREE-ACADEMIC PROGRAM",
    43: "BACHELOR'S DEGREE (EX: BA, AB, BS)",
    44: "MASTER'S DEGREE (EX: MA, MS, MEng, MEd, MSW)",
    45: "PROFESSIONAL SCHOOL DEG (EX: MD, DDS, DVM)",
    46: "DOCTORATE DEGREE (EX: PhD, EdD)",
  },
  'PTDTRACE': {
    1: "White Only",
    2: "Black Only",
    3: "American Indian, Alaskan Native Only",
    4: "Asian Only",
    5: "Hawaiian/Pacific Islander Only",
    6: "White-Black",
    7: "White-AI",
    8: "White-Asian",
    9: "White-HP",
    10: "Black-AI",
    11: "Black-Asian",
    12: "Black-HP",
    13: "AI-Asian",
  }
};

exports.inverseValues = {};
for(var column in exports.values) {
  exports.inverseValues[column] = {};
  for(var code in exports.values[column]) {
    exports.inverseValues[column][exports.values[column][code]] = code;
  }
}

exports.responses = {
  'default': 'Sorry, I don\'t understand your question.'
}
