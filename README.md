
# Blockchain Platforma Strangere de Fonduri

Acest proiect este o platformă bazată pe blockchain pentru strângerea de fonduri, unde utilizatorii pot crea și contribui la campanii utilizând Ethereum.

## Comenzi Terminal

În folderul proiectului, executați următoarele comenzi:

```sh
npx hardhat clean
npx hardhat compile
npx hardhat test
npx hardhat node
```

Într-un alt terminal, în același folder al proiectului:

```sh
npx hardhat run scripts/deploy.js --network localhost
```

## Instalare și rulare interfață web

Intrați în folderul `web` și porniți aplicația:

```sh
cd web
npm start
```

## Funcționalități principale

- Creare campanii de strângere de fonduri
- Contribuții în Ethereum
- Monitorizare progres campanii
- Integrare cu rețeaua blockchain

## Tehnologii utilizate

- Solidity
- Hardhat
- Ethereum
- React
- Node.js

## Implementarea smart-contractelor

### Cerințe obligatorii (maxim 3 puncte) – minim pentru promovare
- Utilizarea tipurilor de date specifice Solidity (mappings, address).
- Înregistrarea de events.
- Utilizarea de modifiers.
- Exemple pentru toate tipurile de funcții (external, pure, view etc.).
- Exemple de transfer de ETH.
- Ilustrarea interacțiunii dintre smart contracte.
- Deploy pe o rețea locală sau pe o rețea de test Ethereum.

### Cerințe opționale (maxim 2 puncte)
- Utilizare librării.
- Implementarea de teste (cu tool-uri la alegerea echipelor).

## Interacțiunea cu blockchain printr-o aplicație web3

### Cerințe obligatorii (maxim 1.5 punct) – minim pentru promovare
- Utilizarea unei librării web3 (exemple web3 sau ethersjs) și conectarea cu un Web3 Provider pentru accesarea unor informații generale despre conturi (adresa, balance).
- Inițierea tranzacțiilor de transfer sau de apel de funcții, utilizând clase din librăriile web3.

### Cerințe opționale (maxim 2,5 puncte)
- Tratare events (Observer Pattern).
- Analiza gas-cost (estimare cost și fixare limită de cost).
- Control al stării tranzacțiilor (tratare excepții).

## Capturi de ecran

### Proiecte active și finalizate
![image](https://github.com/user-attachments/assets/53e9ef00-73b5-40de-8d8c-36fc8f3919c0)


### Creare proiect și conectare MetaMask
![image](https://github.com/user-attachments/assets/f80acbb5-65f8-4e0c-adcd-95de7a2b62eb)
![image](https://github.com/user-attachments/assets/ca02d183-3dde-4814-bc96-9aef77451bc4)
![image](https://github.com/user-attachments/assets/056487b2-e11d-4c3f-98a1-e4b4ad57699c)
![image](https://github.com/user-attachments/assets/989c986f-7723-479f-bac1-55a20d12bc18)
 
