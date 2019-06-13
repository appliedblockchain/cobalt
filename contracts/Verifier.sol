pragma solidity ^0.5.9;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 6, 0, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }
    /// @return the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 7, 0, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[0];
            input[i * 6 + 3] = p2[i].X[1];
            input[i * 6 + 4] = p2[i].Y[0];
            input[i * 6 + 5] = p2[i].Y[1];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := call(sub(gas, 2000), 8, 0, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}
contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G2Point A;
        Pairing.G1Point B;
        Pairing.G2Point C;
        Pairing.G2Point gamma;
        Pairing.G1Point gammaBeta1;
        Pairing.G2Point gammaBeta2;
        Pairing.G2Point Z;
        Pairing.G1Point[] IC;
    }
    struct Proof {
        Pairing.G1Point A;
        Pairing.G1Point A_p;
        Pairing.G2Point B;
        Pairing.G1Point B_p;
        Pairing.G1Point C;
        Pairing.G1Point C_p;
        Pairing.G1Point K;
        Pairing.G1Point H;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.A = Pairing.G2Point([0x213631a331f9c001031a5ca2c92462909eacbf47f1cb8415453762a17e47a07c, 0x4645567bea3cb01cfea3175bc5db1a4c3a6e9e7c8b30d7f1c589e232b3b6cd7], [0x20cff272c26fc833d4bc4f73d49888481b8688fc4548cf16cbaeb2ffea16fe87, 0x2a74706e5a68437a7f70ae9776d947e03b0e137fbbc5e891532921ec0284e854]);
        vk.B = Pairing.G1Point(0x7aaf8eb194b7cf191762954b7b8e6cd9eaeefc91745adc070dd26ac3d830f15, 0x404f76b0c36fd81b440d711c919a0969dc7acacbb5eeabe0f007ab35054d681);
        vk.C = Pairing.G2Point([0x1de003cf6f1d07d759ebdf53fe19c2a887776f19f8fb7c123bf5249dac1dc0bd, 0x1d750f61b47c8d322a3a5d612d38ad414a3ab1250d784000d7040d70bd0f3c22], [0x142a43f136f490add0f091a76a69e8fdba97c0ddfadea0c7d8abe1d596513acc, 0x25b3706172f1c3fba216c262fb711e444ea56844608bce0be60b8153a88c3169]);
        vk.gamma = Pairing.G2Point([0x230c06dae2eed3458e985b021c630ed2a3e397d5bcc6a875766442eeacee8979, 0x1b09b9694e98d025ea32c285276651b89ea5668d30fa234b5ec816b1fc189321], [0x3f88703688fb1f557ccc52a57b47ea067544d13d1db11451ee242f2a246f9d3, 0x221b9dc3cdf62642fc423907e4acacbb428b0c33447c45e51813b6d3c71aa451]);
        vk.gammaBeta1 = Pairing.G1Point(0x20d7e1898b10db2a08aa1bcb69ae52b6f86e2eac27ba1d5bb9f22d91ebd974e, 0x160444447e80f5dbb36f681f8645e5e17bdaa9af69a1c8ddef5bdf725b05074e);
        vk.gammaBeta2 = Pairing.G2Point([0xe7899f4b950be29b370041eab7afe869aa17128d6fe4fcc60797ee2b419e87a, 0x5ae3dcdd644cea1098aa578ac0c342952ed8b5da9d6d64a20f30dfd30b06c81], [0xe42e6994655d07aff5e8bcb5363a41dfdc2623b0d283a390267ac9b182c944a, 0x20e2deb801db0ba2cbf1b1e44f7f11214f5b90ed393fb75152e492278668d1ca]);
        vk.Z = Pairing.G2Point([0x2eed9541104ffba72c35fcc41daf399fde52e957351d35fa910a99676ce75aed, 0x90b95d08c0a36df90165471a43b05ef3be2a4f4c9348fde7820bfefd98dc7a4], [0x1a90e895c46e5ff7582a96472513c0bf1c95b4168f4775427c305988c706a226, 0xe0767db27e2df66ae816bd3bea6962ac4512291a64116e9db5b1a9365daddba]);
        vk.IC = new Pairing.G1Point[](5);
        vk.IC[0] = Pairing.G1Point(0x1185259cbc3af5dff2a4596c9909d669d1fec160854a2773926325eb43ee09de, 0x21a8c4f497fa8a4fde5aa29df5d7b0c80e90efbda567285563b0c467da438529);
        vk.IC[1] = Pairing.G1Point(0x1c53738115556d76471d472ef6e494f5bd64e56f129c36c6eaf5069e3f9463d0, 0x2bf573b18eb44d3a36034706123c2cf818e982255ec01aa8bfaa58a7c26faf09);
        vk.IC[2] = Pairing.G1Point(0x9f0161227c8a6a7799be8cdf3dc056e533d54672c86ef968992030b3128f8fb, 0xd9add78f0f97932496df80e71b2d30f89082a26537336fccfcf5eb10d78fbdf);
        vk.IC[3] = Pairing.G1Point(0x160e53ff8627637aeb8530105a89ffc6cbc9fe927e00928849990d761d952505, 0x55a7bc118bab005e05c4d8ada64001e134785352fe29aa86a0ca36f3f190ab7);
        vk.IC[4] = Pairing.G1Point(0xbe2d4d5379e03fa8e22097fe6b881d87cefa69ca5ce822db54a66f83c0e085f, 0x224d02149894e94d80b9467f23e0d8f3ea40a4838cbaacc3dc5813a21e8a882e);
    }
    function verify(uint[] memory input, Proof memory proof) internal returns (uint) {
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++)
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd2(proof.A, vk.A, Pairing.negate(proof.A_p), Pairing.P2())) return 1;
        if (!Pairing.pairingProd2(vk.B, proof.B, Pairing.negate(proof.B_p), Pairing.P2())) return 2;
        if (!Pairing.pairingProd2(proof.C, vk.C, Pairing.negate(proof.C_p), Pairing.P2())) return 3;
        if (!Pairing.pairingProd3(
            proof.K, vk.gamma,
            Pairing.negate(Pairing.addition(vk_x, Pairing.addition(proof.A, proof.C))), vk.gammaBeta2,
            Pairing.negate(vk.gammaBeta1), proof.B
        )) return 4;
        if (!Pairing.pairingProd3(
                Pairing.addition(vk_x, proof.A), proof.B,
                Pairing.negate(proof.H), vk.Z,
                Pairing.negate(proof.C), Pairing.P2()
        )) return 5;
        return 0;
    }
    event Verified(string s);
    function verifyTx(
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[4] memory input
        ) public returns (bool r) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.A_p = Pairing.G1Point(a_p[0], a_p[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.B_p = Pairing.G1Point(b_p[0], b_p[1]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        proof.C_p = Pairing.G1Point(c_p[0], c_p[1]);
        proof.H = Pairing.G1Point(h[0], h[1]);
        proof.K = Pairing.G1Point(k[0], k[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            emit Verified("Transaction successfully verified.");
            return true;
        } else {
            return false;
        }
    }
}
