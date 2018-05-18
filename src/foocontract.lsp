(seq

  (include "./lib/constants.lsp")
  (include "./lib/utilities.lsp")

  (codecopy m_keyHash (bytecodesize) 0x20) ;; first 32bytes for bytes32 keyHash
  (codecopy m_expiration (+ (bytecodesize) 0x20) 0x20) ;; next 32bytes for uint256 expiration
  (codecopy m_recipient (+ (bytecodesize) 0x4c) 0x14) ;; skip 12 bytes and read 20 bytes for address recipient

  (sstore s_keyHash @m_keyHash)
  (sstore s_expiration @m_expiration)
  (sstore s_recipient @m_recipient)
  (sstore s_deployer (origin))

  (returnlll
    (seq
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
            (jump invalid-location))))

      (panic))))
