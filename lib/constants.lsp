(seq

  ;; Storage.
  (def 'deployer 0x00)
  (def 'keyHash 0x01)
  (def 'expiration 0x02)
  (def 'recipient 0x03)
  (def 'swapval 0x04)

  ;; Jumping here causes an EVM error.
  (def 'invalid-location 0x02)

  (def 'ethswap 0x035878a0) ; ethswap(address)
  (def 'set 0x60ed0644) ; set(bytes32,uint256,address)
  (def 'claim 0xbd66528a) ; claim(bytes32)
  (def 'expire 0x79599f96) ; expire()

)
