---
sidebar_position: 2
title: PSP22 - Fungible Token (ERC20 equivalent)
sidebar_label: PSP22 - Fungible Token
---

# PSP22 - Fungible Token (ERC20 equivalent)

## Overview

In this tutorial we will see how to implement the PSP22 Fungible Token, an ERC20 equivalent on Astar Network or any Substrate Contracts Node with OpenBrush. 

We will introduce:
- All functions present in the PSP22 standard,
- All extensions for PSP22 token,
- All events emitted by the contract,
- How to implement the security,
- How to add custom logic.

## Prerequisites

The version 1.72 (or higher) of Rust and the version 3.2.0 (or higher) of cargo-contract must be installed.  
To check the versions.
```bash
cargo --version
cargo-contract --version
```

## Create a new project

Use the command `cargo contract new` to create a new rust project (in this tutorial the project name is lucky_psp22)

```bash
cargo contract new lucky_psp22
```

## Use OpenBrush

Add `openbrush` in your `Cargo.toml` file and enable the `psp22` feature.

```toml
openbrush = { git = "https://github.com/Brushfam/openbrush-contracts", version = "4.0.0", default-features = false, features=["psp22"] }

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

#[openbrush::implementation(PSP22)]
#[openbrush::contract]
pub mod lucky_psp22 {

    use openbrush::contracts::psp22;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
    	#[storage_field]
	psp22: psp22::Data,
    }
    
    impl LuckyPsp22 {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            let mut instance = Self::default();
            psp22::Internal::_mint(&mut instance, Self::env().caller(), initial_supply).expect("Should mint"); 
            instance
        }
    }
}
```

And that’s all! It’s really easy to create a PSP22 (ERC20 equivalent) token!

You can now deploy your contract on any Substrate Contracts Node and start playing with it.

# PSP22 - Functions

```rust
psp22::totalSupply()
psp22::balanceOf(account)
psp22::transfer(to, value)
psp22::allowance(owner, spender)
psp22::approve(spender, value)
psp22::increaseAllowance(spender, value)
psp22::decreaseAllowance(spender, value)
psp22::transferFrom(from, to, value)
```

    totalSupply() → Balance

Returns the value of tokens in existence.

    balanceOf(account: AccountId) → Balance

Returns the value of tokens owned by `account`.

    transfer(to: AccountId, value: Balance)

Moves a `value` amount of tokens from the caller’s account to `to`.

    allowance(owner: AccountId, spender: AccountId) → Balance

Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through `transferFrom`. This is zero by default.

This value changes when `approve` or `transferFrom` are called.

    approve(spender: AccountId, value: Balance)

Sets a `value` amount of tokens as the allowance of `spender` over the caller’s tokens.

**Important**: Beware this method is **Vulnerable to Double-Spending**: changing an allowance with this method brings the risk that someone may use both the old and the new allowance by unfortunate transaction ordering.

You can have more information about this issue in the security review from OpenZeppelin: https://blog.openzeppelin.com/openbrush-contracts-library-security-review

**To avoid Double-Spending attack, you must use** the `increaseAllowance` and `decreaseAllowance` functions to modify token allowances for user expenditure.

    increaseAllowance(spender: AccountId, value: Balance)
    decreaseAllowance(spender: AccountId, value: Balance)

Increase or decrease a `value` amount of tokens as the allowance of `spender` over the caller’s tokens.

    transferFrom(from: AccountId, to: AccountId, value: Balance)

Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism. `value` is then deducted from the caller’s allowance.

Fails and returns an error if the `caller` is not allowed to spend `value` amount of tokens on behalf of `from`.

# Extensions

You can also use extensions for PSP22 token:
 - `PSP22Metadata`: Provides the ability to add extra information to the token, such as a symbol and a name. 
 - `PSP22Mintable`: Allows PSP22 tokens to be minted. 
 - `PSP22Burnable`: Allows PSP22 tokens to be burned. 
 - `PSP22Capped`: Allows PSP22 tokens to be capped.

## PSP22 Metadata

Extends the implementation with `PSP22Metadata`, defines the storage and the constructor.

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP22, PSP22Metadata)]
#[openbrush::contract]
pub mod lucky_psp22 {

    use openbrush::contracts::psp22;
    use openbrush::contracts::psp22::extension::metadata;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp22: psp22::Data,
        #[storage_field]
        metadata: metadata::Data,
    }
    
    impl LuckyPsp22 {
        #[ink(constructor)]
        pub fn new(total_supply: Balance, name: Option<String>, symbol: Option<String>, decimal: u8) -> Self {
           let mut instance = Self::default();
           let caller = instance.env().caller();
 
           instance.metadata.name.set(&name);
           instance.metadata.symbol.set(&symbol);
           instance.metadata.decimals.set(&decimal);

           psp22::Internal::_mint_to(&mut instance, caller, total_supply).expect("Should mint total_supply");

           instance
       }
    }
}
```

## PSP22 Metadata - Functions

```rust
psp22Metadata::tokenName()
psp22Metadata::tokenSymbol()
psp22Metadata::tokenDecimals()
```

    tokenName() → Option

Returns the name of the token.

    tokenSymbol() → Option

Returns the symbol of the token.

    tokenDecimals() → Option

Returns the decimals places of the token.

## PSP22 Mintable

Extends the implementation of `PSP22Mintable`

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP22, PSP22Mintable)]
#[openbrush::contract]
pub mod lucky_psp22 {

    use openbrush::contracts::psp22;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp22: psp22::Data,
    }
    
    impl LuckyPsp22 {
        #[ink(constructor)]
        pub fn new(total_supply: Balance) -> Self {
           let mut instance = Self::default();
           let caller = instance.env().caller();
 
           psp22::Internal::_mint_to(&mut instance, caller, total_supply).expect("Should mint total_supply");

           instance
       }
    }
}
```

## PSP22 Mintable - Functions

```rust
psp22Mintable::mint(account, value)
```

    mint(account: AccountId, value: Balance)

Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address 0.

## PSP22 Burnable

Extends the implementation with `PSP22Burnable`

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP22, PSP22Burnable)]
#[openbrush::contract]
pub mod lucky_psp22 {

    use openbrush::contracts::psp22;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp22: psp22::Data,
    }
    
    impl LuckyPsp22 {
        #[ink(constructor)]
        pub fn new(total_supply: Balance) -> Self {
           let mut instance = Self::default();
           let caller = instance.env().caller();
 
           psp22::Internal::_mint_to(&mut instance, caller, total_supply).expect("Should mint total_supply");

           instance
       }
    }
}
```

## PSP22 Burnable - Functions

```rust
psp22Burnable::burn(account, value)
```

    burn(account: AccountId, value: Balance)

Destroys a `value` amount of tokens from the `account`, deducting from the caller’s allowance.

Fails and returns an error if the `caller` is not allowed to spend `value` amount of tokens on behalf of `account`.

## PSP22 Capped

Extends the implementation with `PSP22Capped`, defines the storage and the constructor

```rust
#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[openbrush::implementation(PSP22, PSP22Capped)]
#[openbrush::contract]
pub mod lucky_psp22 {

    use openbrush::contracts::psp22;
    use openbrush::contracts::psp22::extensions::capped;
    use openbrush::traits::Storage;

    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct Contract {
        #[storage_field]
        psp22: psp22::Data,
        #[storage_field]
        cap: capped::Data,
    }
    
    impl LuckyPsp22 {
        #[ink(constructor)]
        pub fn new(total_supply: Balance, cap: Balance) -> Self {
           let mut instance = Self::default();
           let caller = instance.env().caller();
            capped::Internal::_init_cap(&mut instance, cap).expect("Should cap the supply");
           psp22::Internal::_mint_to(&mut instance, caller, total_supply).expect("Should mint initial_supply");

           instance
       }
    }
}
```

## PSP22 Capped - Functions

```rust
PSP22Capped::cap()
```

    cap() → Balance

Returns the cap on the token’s total supply.

## Events

By default, no event is emitted.

However, to keep track of all funds received, you can override the following functions to emit custom events:

```rust
_emit_transfer_event(from: Option, to: Option, amount: Balance)
```

This function is called when:
- a transfer is done, 
- new tokens are minted, 
- some tokens are burned.

```rust
_emit_approval_event(owner: AccountId, spender: AccountId, amount: Balance)
```

This function is called each time the allowance is updated.

For example:

```rust
#[overrider(psp22::Internal)]
fn _emit_transfer_event(&self, from: Option<AccountId>, to: Option<AccountId>, amount: Balance) {
    let contract_id = self.env().account_id();
    self.env().emit_event(Psp22Transfer{contract_id, from, to, amount});
}

#[overrider(psp22::Internal)]
fn _emit_approval_event(&self, owner: AccountId, spender: AccountId, amount: Balance) {
    let contract_id = self.env().account_id();
    self.env().emit_event(Psp22Approval{contract_id, owner, spender, amount});
}
```

## Security

By default, no security is implemented, but you can use the modifiers macro to restrict the access.

For example:

```rust
#[default_impl(PSP22Mintable)]
#[modifiers(ownable::only_owner)]
fn mint() {}

#[default_impl(PSP22Burnable)]
#[modifiers(ownable::only_owner)]
fn burn() {}
```

## Custom logic

For further, you can override the following functions to add custom logic before and after all token transfers

```rust
_before_token_transfer(from: AccountId, to: AccountId, amount: Balance)
_after_token_transfer(from: AccountId, to: AccountId, amount: Balance)
```
For example:

```rust
#[overrider(psp22::Internal)]
fn _before_token_transfer(
    &mut self,
    from: Option<&AccountId>,
    _to: Option<&AccountId>,
    _amount: &Balance,
) -> Result<(), PSP22Error> {
    if from == self.banned_account.get() {
        return Err(PSP22Error::InsufficientAllowance)
    }
    Ok(())
}
```

## Conclusion

OpenBrush provides the default implementation of traits for the PSP22 Standard and it is easy for the developers to create a PSP22 token and customize the business logic.

However, some features could be improved, specially the events emitting and the security could be included natively in the library.


## References

- https://learn.brushfam.io/docs/OpenBrush/smart-contracts/PSP22/
- https://blog.openzeppelin.com/openbrush-contracts-library-security-review


## Author

This tutorial was written by GuiGou, Astar ecosystem agent.  
If you have some questions, please contact me on [X](https://twitter.com/GuiGou12358).
