(seq

  (include "./lib/constants.lsp")
  (include "./lib/utilities.lsp")

  (returnlll
    (seq
      (function ethswap
        (seq
          (sstore 0 (calldataload 0))
          (stop)))

      (function set
        (seq
          (sstore keyHash (calldataload 4))
          (sstore expiration (calldataload 36))
          (sstore recipient (calldataload 68))
          (sstore deployer (origin))
          (stop)))

      (function expire
        (if (> (timestamp) @@expiration)
          (send @@deployer (balance (address)))
          (jump invalid-location)))

      (function claim
        (seq only-recipient
          (mstore 0x0 (calldataload 4))
          (mstore 0x0 (sha3 0x0 32))

          (if (= @@keyHash @0x0)
            (send @@recipient (balance (address)))
            (jump invalid-location)))))))
