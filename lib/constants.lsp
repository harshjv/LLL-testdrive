(seq

  ;; Memory.
  (def 'm_keyHash 0x20)
  (def 'm_expiration 0x40)
  (def 'm_recipient 0x60)

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

  ;; For debugging purpose

  (def 'get0 0x371988fa) ; get0(bytes32)
  (def 'get1 0x9c117f0f) ; get1(uint256)
  (def 'get2 0x243de4ee) ; get2(address)
  (def 'get3 0xf13e90ae) ; get3(address)

)
