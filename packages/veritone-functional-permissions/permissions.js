'use strict';

// use json format below (quoted key names) so that it can be copy pasted to permissions_json.go

/* eslint-disable quotes, quote-props */
module.exports = {
	"superadmin": 1,
	"veritone": {
		"superadmin": 1,
		"financeadmin": 121
	},
	"admin_ui_legacy": {
		"access": 124
	},
	"admin": {
		"access": 2,
		"org": {
			"read": 3,
			"update": 4
		},
		"user": {
			"create": 5,
			"read": 6,
			"update": 7,
			"delete": 8
		},
		"group": {
			"create": 9,
			"read": 10,
			"update": 11,
			"delete": 12
		},
		"profile": {
			"read": 73,
			"update": 74
		},
		"roles": {
			"create": 75,
			"read": 76,
			"update": 77,
			"delete": 78
		}
	},
	"advertiser": {
		"access": 60
	},
	"analytics": {
		"access": 61,
		"dashboard": {
			"view": 72,
			"update": 79
		}
	},
	"broadcaster": {
		"access": 62
	},
	"cms": {
		"access": 13,
		"media": {
			"create": 14,
			"read": 15,
			"update": 16,
			"delete": 17,
			"share": 80,
			"download": 81
		},
		"workflows": {
			"create": 18,
			"read": 19,
			"update": 20,
			"delete": 21
		},
		"contenttemplates": {
			"create": 22,
			"read": 23,
			"update": 24,
			"delete": 25
		},
		"job": {
			"create": 26,
			"read": 27,
			"update": 28,
			"delete": 29
		},
		"task": {
			"create": 30,
			"read": 31,
			"update": 32,
			"delete": 33
		},
		"recording": {
			"create": 34,
			"read": 35,
			"update": 36,
			"delete": 37
		},
		"report": {
			"create": 38
		},
		"sources": {
			"read": 82,
			"update": 83,
			"delete": 84
		},
		"analytics": {
			"read": 39
		},
		"customerservice": 125
	},
	"collections": {
		"access": 40,
		"collections": {
			"create": 41,
			"read": 42,
			"update": 43,
			"delete": 44,
			"share": 64
		},
		"mentions": {
			"create": 65,
			"read": 66,
			"update": 67,
			"delete": 68,
			"share": 70,
			"download": 71
		},
		"users": {
			"read": 69
		}
	},
	"discovery": {
		"access": 45,
		"analytics": {
			"read": 46,
			"download": 47,
			"share": 90
		},
		"mentions": {
			"create": 48,
			"read": 49,
			"update": 50,
			"delete": 51,
			"share": 52,
			"download": 53
		},
		"watchlist": {
			"create": 54,
			"read": 55,
			"update": 56,
			"delete": 57,
			"share": 58,
			"download": 59
		},
		"folder": {
			"create": 85,
			"read": 86,
			"update": 87,
			"delete": 88,
			"share": 89
		},
		"results": {
			"read": 91,
			"share": 92,
			"download": 93
		}
	},
	"politics": {
		"access": 63
	},
	"developer": {
		"access": 94,
		"docker": {
			"admin": 95,
			"org": {
				"push": 96,
				"pull": 97,
				"user": {
					"push": 98,
					"pull": 99
				}
			}
		},
		"engine": {
			"read": 100,
			"update": 101,
			"create": 102,
			"delete": 103,
			"disable": 104,
			"enable": 105
		},
		"build": {
			"read": 106,
			"update": 107,
			"create": 108,
			"delete": 109,
			"invalidate": 110,
			"upload": 111,
			"deploy": 112,
			"submit": 113,
			"pause": 114,
			"unpause": 115,
			"approve": 116,
			"disapprove": 117
		},
		"task": {
			"read": 118,
			"update": 119,
			"create": 120
		}
	},
	"job": {
		"create": 26,
		"read": 27,
		"update": 28,
		"delete": 29
	},
	"task": {
		"create": 30,
		"read": 31,
		"update": 32,
		"delete": 33
	},
	"recording": {
		"create": 34,
		"read": 35,
		"update": 36,
		"delete": 37
	},
	"asset": {
		"all": 122,
		"uri": 123
	},
	"source": {
		"update": 126
	},
	"workflow": {
		"create": 253
	},
	"mentions": {
		"create": 127,
		"read": 128,
		"update": 129,
		"delete": 130,
		"share": 131,
		"download": 132
	}
}
;
/* eslint-enable quotes, quote-props */
