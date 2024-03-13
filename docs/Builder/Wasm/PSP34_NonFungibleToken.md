---
sidebar_position: 3
title: PSP34 - Non-Fungible Token (ERC721 equivalent)
sidebar_label: PSP34 - Non-Fungible Token
---
# PSP34 - Non-Fungible Token (ERC721 equivalent)

## Overview

In this tutorial we will see how to implement the PSP34 Fungible Token, an ERC721 equivalent on Astar Network or any Substrate Contracts Node with OpenBrush. 

We will introduce:
- All functions present in the PSP34 standard,
- All extensions for PSP34 token,
- All events emitted by the contract,
- How to implement the security.

## Prerequisites

The version 1.72 (or higher) of Rust and the version 3.2.0 (or higher) of cargo-contract must be installed.  
To check the versions.
```bash
cargo --version
cargo-contract --version
```

## Create a new project

Use the command `cargo contract new` to create a new rust project (in this tutorial the project name is lucky_psp34)

```bash
cargo contract new lucky_psp34
```

## Use OpenBrush

Add `openbrush` in your `Cargo.toml` file and enable the `psp34` feature.

```toml
openbrush = { git = "https://github.com/Brushfam/openbrush-contracts", version = "4.0.0", default-features = false, features=["psp34"] }

[features]
default = ["std"]
std = [
    "ink/std",
    "scale/std",
    "scale-info/std",
    "openbrush/std"
]
```

## Define storage and constructor

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP34)]
#[openbrush::contract]
pub mod lucky_psp34 {

    use openbrush::contracts::psp34;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
    	#[storage_field]
	psp34: psp34::Data,
    }
    
    impl LuckyPsp34 {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self::default()
        }
    }
}
```

And that’s all! It’s really easy to create a PSP34 (ERC721 equivalent) token!

You can now deploy your contract on any Substrate Contracts Node and start playing with it.

# PSP34 - Functions

```rust
psp34::collectionId()
psp34::totalSupply()
psp34::balanceOf(owner)
psp34::ownerOf(tokenId)
psp34::transfer(to, tokenId, data)
psp34::allowance(owner, operator, tokenId)
psp34::approve(operator, tokenId, approved)
```

    collectionId() → Bytes

Returns the token collection id.

    totalSupply() → Balance

Returns the number of tokens in existence.

    balanceOf(owner: AccountId) → Balance

Returns the number of tokens in `owner`'s account.

    ownerOf(tokenId: Id) → AccountId

Returns the owner of the `tokenId` token. 

**Requirement**: `tokenId` must exist.

    transfer(to: AccountId, tokenId: Id, data: String)

Move `tokenId` token `from` caller to `to`. 

Emits a `Transfer` event.

    allowance(owner: AccountId, operator: AccountId, tokenId: Id) → bool

Returns true if `operator` is allowed to transfer `tokenId` token on behalf of `owner`. 

This is false by default. 

This value changes when `approve` is called. 

    approve(operator: AccountId, tokenId: Id, approved: bool)

Gives permission to `operator` to transfer `tokenId` token to another account.

**Requirements**:
- The caller must own the token or be an approved operator, 
- `tokenId` must exist.

Emits an `Approval` event.

# Extensions

You can also use extensions for PSP34 token:
 - `PSP34Metadata`: Provides the ability to add extra information to the token, such as a symbol, a name or an URI or any attributes ,
 - `PSP34Mintable`: Allows PSP34 tokens to be minted,
 - `PSP34Burnable`: Allows PSP34 tokens to be burned, 
 - `PSP34Enumerable`: Allows PSP34 tokens to be enumerated.

## PSP34 Metadata

Extends the implementation with `PSP34Metadata`, defines the storage and the constructor.

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP34, PSP34Metadata)]
#[openbrush::contract]
pub mod lucky_psp34 {

    use openbrush::contracts::psp34;
    use openbrush::contracts::psp34::extension::metadata;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp34: psp34::Data,
        #[storage_field]
        metadata: metadata::Data,
    }
    
    impl LuckyPsp34 {
        #[ink(constructor)]
        pub fn new(id: Id, name: String, symbol: String, uri: String) -> Self {
           let mut instance = Self::default();
           metadata::Internal::_set_attribute(&mut instance, id.clone(), "name".to_string(), name);
           metadata::Internal::_set_attribute(&mut instance, id.clone(), "symbol".to_string(), symbol);
           metadata::Internal::_set_attribute(&mut instance, id.clone(), "uri".to_string(), uri);

           instance
       }
    }
}
```

## PSP34 Metadata - Functions

```rust
psp34Metadata::getAttribute(tokenId: ID, attribute: String) → Option
```

Returns the value of `attribute` attribute of the `tokenId` token.

## PSP34 Mintable

Extends the implementation with `PSP34Mintable`.

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP34, PSP34Mintable)]
#[openbrush::contract]
pub mod lucky_psp34 {

    use openbrush::contracts::psp34;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp34: psp34::Data,
    }
    
    impl LuckyPsp34 {
        #[ink(constructor)]
        pub fn new() -> Self {
           Self::default()
       }
    }
}
```

## PSP34 Mintable - Functions

```rust
psp34Mintable::mint(account: AccountId, tokenId: Id)
```

Mints `tokenId` and transfers it to `account`.

## PSP34 Burnable

Extends the implementation with `PSP34Burnable`.

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP34, PSP34Burnable)]
#[openbrush::contract]
pub mod lucky_psp34 {

    use openbrush::contracts::psp34;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp34: psp34::Data,
    }
    
    impl LuckyPsp34 {
        #[ink(constructor)]
        pub fn new(total_supply: Balance) -> Self {
           Self::default()
       }
    }
}
```

## PSP34 Burnable - Functions

```rust
psp34Burnable::burn(owner: AccountId, tokenId: Id)
```

Destroys `tokenId` token owned by `owner`. The approval is cleared when the token is burned.

**Requirement**: `tokenId` must exist and `owner` must be the owner of the token.

Emits a `Transfer` event.

## PSP34 Enumerable

Extends the implementation with `PSP34Enumerable`, defines the storage and the constructor.

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP34, PSP34Enumerable)]
#[openbrush::contract]
pub mod lucky_psp34 {

    use openbrush::contracts::psp34;
    use openbrush::contracts::psp34::extensions::enumerable;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp34: psp34::Data,
        #[storage_field]
        enumerable: enumerable::Data,
    }
    
    impl LuckyPsp34 {
        #[ink(constructor)]
        pub fn new(total_supply: Balance) -> Self {
           Self::default()
       }
    }
}
```

## PSP34 Enumerable - Functions

```rust
psp34Enumerable::tokenByIndex(index)
psp34Enumerable::ownersTokenByIndex(owner, index)
```

    ownersTokenByIndex(owner: AccountId, index: u256) → Id

Returns a token ID owned by `owner` at a given `index` of its token list. Use along with `balanceOf` to enumerate all of `owner`'s tokens.

    tokenByIndex(index: u256) → Id

Returns a token ID at a given `index` of all the tokens stored by the contract. Use along with `totalSupply` to enumerate all tokens.

## Events

By default, no event is emitted.

However, to keep track of all tokens, you can override the following functions to emit custom events:

```rust
_emit_transfer_event(from: Option, to: Option, tokenId: Id)
```

This function is called when:
- a transfer is done, 
- new tokens are minted, 
- some tokens are burned.

```rust
_emit_approval_event(owner: AccountId, spender: AccountId, tokenId: Id, approved: bool)
```

This function is called each time the allowance is updated.

For example:

```rust
#[overrider(psp34::Internal)]
fn _emit_transfer_event(&self, from: Option<AccountId>, to: Option<AccountId>, amount: Balance) {
    let contract_id = self.env().account_id();
    self.env().emit_event(Psp34Transfer{contract_id, from, to, amount});
}

#[overrider(psp34::Internal)]
fn _emit_approval_event(&self, owner: AccountId, spender: AccountId, amount: Balance) {
    let contract_id = self.env().account_id();
    self.env().emit_event(Psp34Approval { contract_id, owner, spender, amount });
}
```

## Security

By default, no security is implemented, but you can use the `modifiers` macro to restrict the access.

For example:

```rust
#[default_impl(PSP34Mintable)]
#[modifiers(ownable::only_owner)]
fn mint() {}

#[default_impl(PSP34Burnable)]
#[modifiers(ownable::only_owner)]
fn burn() {}
```

## Conclusion

OpenBrush provides the default implementation of traits for the PSP34 Standard and it is easy for the developers to create a PSP34 token and customize the business logic.

However, some features could be improved, specially the events emitting and the security could be included natively in the library.


## References

- https://learn.brushfam.io/docs/OpenBrush/smart-contracts/PSP34/
- https://blog.openzeppelin.com/openbrush-contracts-library-security-review


## Author

This tutorial was written by GuiGou, Astar ecosystem agent.  
If you have some questions, please contact me on [X](https://twitter.com/GuiGou12358).
