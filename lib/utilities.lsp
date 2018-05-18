(seq

  (def 'bytes4 (input)
    (div input (exp 2 224)))

  (def 'function (function-hash body)
    (when (= (bytes4 (calldataload 0)) function-hash)
      body))

  (def 'only-recipient
    (when (!= (caller) @@recipient)
      (panic)))

)
