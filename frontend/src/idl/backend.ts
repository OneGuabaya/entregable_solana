/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/backend.json`.
 */
export type Backend = {
  "address": "TLx9BAKaDHPT3aeZy3j6EzUmiXCcTsj86Dzv8LYL3a6",
  "metadata": {
    "name": "backend",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "deleteDeveloper",
      "discriminator": [
        11,
        248,
        52,
        0,
        76,
        132,
        176,
        39
      ],
      "accounts": [
        {
          "name": "devAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  101,
                  108,
                  111,
                  112,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "registerDeveloper",
      "discriminator": [
        84,
        32,
        122,
        101,
        24,
        135,
        152,
        65
      ],
      "accounts": [
        {
          "name": "devAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  101,
                  108,
                  111,
                  112,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "lastName",
          "type": "string"
        },
        {
          "name": "city",
          "type": "string"
        },
        {
          "name": "country",
          "type": "string"
        },
        {
          "name": "contact",
          "type": "string"
        },
        {
          "name": "techs",
          "type": "string"
        },
        {
          "name": "hourlyRate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateDeveloper",
      "discriminator": [
        188,
        50,
        189,
        171,
        226,
        39,
        12,
        129
      ],
      "accounts": [
        {
          "name": "devAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  101,
                  108,
                  111,
                  112,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "lastName",
          "type": "string"
        },
        {
          "name": "city",
          "type": "string"
        },
        {
          "name": "country",
          "type": "string"
        },
        {
          "name": "contact",
          "type": "string"
        },
        {
          "name": "techs",
          "type": "string"
        },
        {
          "name": "hourlyRate",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "developerProfile",
      "discriminator": [
        124,
        166,
        166,
        245,
        18,
        106,
        19,
        219
      ]
    }
  ],
  "types": [
    {
      "name": "developerProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "lastName",
            "type": "string"
          },
          {
            "name": "city",
            "type": "string"
          },
          {
            "name": "country",
            "type": "string"
          },
          {
            "name": "contact",
            "type": "string"
          },
          {
            "name": "techs",
            "type": "string"
          },
          {
            "name": "hourlyRate",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
