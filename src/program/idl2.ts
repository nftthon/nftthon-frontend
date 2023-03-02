export type NftContest = {
  "version": "0.1.0",
  "name": "nft_contest",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "programOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "counter2"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "launch",
      "accounts": [
        {
          "name": "contestOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "contest2"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "contest_owner"
              },
              {
                "kind": "account",
                "type": "u64",
                "account": "Counter",
                "path": "counter.contest_count"
              }
            ]
          }
        },
        {
          "name": "prizeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeVaultAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "prize_vault2"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "contest_owner"
              },
              {
                "kind": "account",
                "type": "u64",
                "account": "Counter",
                "path": "counter.contest_count"
              }
            ]
          }
        },
        {
          "name": "prizeTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "prizeAmount",
          "type": "u64"
        },
        {
          "name": "percentageToArtist",
          "type": "u8"
        },
        {
          "name": "submitStartAt",
          "type": "u64"
        },
        {
          "name": "submitEndAt",
          "type": "u64"
        },
        {
          "name": "voteStartAt",
          "type": "u64"
        },
        {
          "name": "voteEndAt",
          "type": "u64"
        },
        {
          "name": "vecSize",
          "type": "u8"
        }
      ]
    },
    {
      "name": "submit",
      "accounts": [
        {
          "name": "artist",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "artwork",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "artwork"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Contest",
                "path": "contest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "artist"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftVaultAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "nft_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Contest",
                "path": "contest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "artist"
              }
            ]
          }
        },
        {
          "name": "artworkTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "vote",
      "accounts": [
        {
          "name": "voter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "artwork",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteData",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "vote"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Contest",
                "path": "contest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "voter"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "votedArtworkId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimByArtist",
      "accounts": [
        {
          "name": "artist",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "artwork",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVaultAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "artistTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimByVoter",
      "accounts": [
        {
          "name": "voter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "artwork",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "voteData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVaultAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voterTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "contestCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "contest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "contestId",
            "type": "u64"
          },
          {
            "name": "contestOwner",
            "type": "publicKey"
          },
          {
            "name": "prizeAmount",
            "type": "u64"
          },
          {
            "name": "percentageToArtist",
            "type": "u8"
          },
          {
            "name": "submitStartAt",
            "type": "u64"
          },
          {
            "name": "submitEndAt",
            "type": "u64"
          },
          {
            "name": "voteStartAt",
            "type": "u64"
          },
          {
            "name": "voteEndAt",
            "type": "u64"
          },
          {
            "name": "artworkCount",
            "type": "u64"
          },
          {
            "name": "artworksVoteCounter",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "artwork",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "artworkId",
            "type": "u64"
          },
          {
            "name": "associatedContestId",
            "type": "u64"
          },
          {
            "name": "artistKey",
            "type": "publicKey"
          },
          {
            "name": "artworkTokenAccount",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "voteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "voterKey",
            "type": "publicKey"
          },
          {
            "name": "votedArtworkId",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CounterAlreadyInitialized",
      "msg": "Counter account is already initialized"
    },
    {
      "code": 6001,
      "name": "CounterNotInitialized"
    },
    {
      "code": 6002,
      "name": "Launch"
    },
    {
      "code": 6003,
      "name": "Submit"
    },
    {
      "code": 6004,
      "name": "Vote"
    }
  ]
};

export const IDL: NftContest = {
  "version": "0.1.0",
  "name": "nft_contest",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "programOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "counter2"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "launch",
      "accounts": [
        {
          "name": "contestOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "counter",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "contest2"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "contest_owner"
              },
              {
                "kind": "account",
                "type": "u64",
                "account": "Counter",
                "path": "counter.contest_count"
              }
            ]
          }
        },
        {
          "name": "prizeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeVaultAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "prize_vault2"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "contest_owner"
              },
              {
                "kind": "account",
                "type": "u64",
                "account": "Counter",
                "path": "counter.contest_count"
              }
            ]
          }
        },
        {
          "name": "prizeTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "prizeAmount",
          "type": "u64"
        },
        {
          "name": "percentageToArtist",
          "type": "u8"
        },
        {
          "name": "submitStartAt",
          "type": "u64"
        },
        {
          "name": "submitEndAt",
          "type": "u64"
        },
        {
          "name": "voteStartAt",
          "type": "u64"
        },
        {
          "name": "voteEndAt",
          "type": "u64"
        },
        {
          "name": "vecSize",
          "type": "u8"
        }
      ]
    },
    {
      "name": "submit",
      "accounts": [
        {
          "name": "artist",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "artwork",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "artwork"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Contest",
                "path": "contest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "artist"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftVaultAccount",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "nft_vault"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Contest",
                "path": "contest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "artist"
              }
            ]
          }
        },
        {
          "name": "artworkTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "vote",
      "accounts": [
        {
          "name": "voter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "artwork",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voteData",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "vote"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Contest",
                "path": "contest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "voter"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "votedArtworkId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimByArtist",
      "accounts": [
        {
          "name": "artist",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "artwork",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "prizeVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVaultAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "artistTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "claimByVoter",
      "accounts": [
        {
          "name": "voter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "artwork",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contest",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "voteData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "prizeVaultAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "voterTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "counter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "contestCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "contest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "contestId",
            "type": "u64"
          },
          {
            "name": "contestOwner",
            "type": "publicKey"
          },
          {
            "name": "prizeAmount",
            "type": "u64"
          },
          {
            "name": "percentageToArtist",
            "type": "u8"
          },
          {
            "name": "submitStartAt",
            "type": "u64"
          },
          {
            "name": "submitEndAt",
            "type": "u64"
          },
          {
            "name": "voteStartAt",
            "type": "u64"
          },
          {
            "name": "voteEndAt",
            "type": "u64"
          },
          {
            "name": "artworkCount",
            "type": "u64"
          },
          {
            "name": "artworksVoteCounter",
            "type": {
              "vec": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "artwork",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "artworkId",
            "type": "u64"
          },
          {
            "name": "associatedContestId",
            "type": "u64"
          },
          {
            "name": "artistKey",
            "type": "publicKey"
          },
          {
            "name": "artworkTokenAccount",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "voteData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "voterKey",
            "type": "publicKey"
          },
          {
            "name": "votedArtworkId",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CounterAlreadyInitialized",
      "msg": "Counter account is already initialized"
    },
    {
      "code": 6001,
      "name": "CounterNotInitialized"
    },
    {
      "code": 6002,
      "name": "Launch"
    },
    {
      "code": 6003,
      "name": "Submit"
    },
    {
      "code": 6004,
      "name": "Vote"
    }
  ]
};
