(seq

  ;; Memory.
  (def 'scratch 0x00)

  ;; Storage.
  (def 's_keyHash 0x00)
  (def 's_expiration 0x01)
  (def 's_recipient 0x02)
  (def 's_deployer 0x03)

  ;; Jumping here causes an EVM error.
  (def 'invalid-location 0x02)

  (def 'set 0x60ed0644) ; set(bytes32,uint256,address)
  (def 'claim 0xbd66528a) ; claim(bytes32)
  (def 'expire 0x79599f96) ; expire()

)
