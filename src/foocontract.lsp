(seq

  (include "./lib/constants.lsp")
  (include "./lib/utilities.lsp")

  (returnlll
    (seq
      (function ethswap
        (seq
          (sstore 0x0 (calldataload 0x0))
          (stop)))

      (function set
        (seq
          (sstore keyHash (calldataload 0x04))
          (sstore expiration (calldataload 0x24))
          (sstore recipient (calldataload 0x44))
          (sstore deployer (origin))
          (stop)))

      (function expire
        (if (> (timestamp) @@expiration)
          (send @@deployer (balance (address)))
          (jump invalid-location)))

      (function claim
        (seq only-recipient
          (mstore 0x0 (calldataload 0x04))
          (mstore 0x0 (sha3 0x0 0x20))

          (if (= @@keyHash @0x0)
            (send @@recipient (balance (address)))
            (jump invalid-location)))))))
