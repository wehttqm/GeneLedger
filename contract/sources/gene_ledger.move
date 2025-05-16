module gene_ledger_addr::GeneLedger {
    use std::signer;
    use std::vector;
    use aptos_framework::object::{Self, ExtendRef};

    // New struct to store addresses
    struct AddressList has key {
        addresses: vector<address>,
    }

    struct Entry has key {
        merkle_root: vector<u8>,
        date: u64,
        snp_hashes: vector<vector<u8>>,
        called: bool,
    }

    const SEED: vector<u8> = b"red_rocks";

    struct BoardObjectController has key {
        extend_ref: ExtendRef,
    }

    // Called once to create the object and controller
    fun init_module(sender: &signer) {
        let constructor_ref = &object::create_named_object(sender, SEED);
        move_to(&object::generate_signer(constructor_ref), BoardObjectController {
            extend_ref: object::generate_extend_ref(constructor_ref),
        });
    }

    // ======================== Write Functions ========================

    public entry fun post_address(
        _sender: &signer,
    ) acquires AddressList, BoardObjectController, Entry {
        if (exists<Entry>(signer::address_of(_sender))) {
            let entry = borrow_global_mut<Entry>(signer::address_of(_sender));
            if (entry.called == false) {
                entry.called = true;
                if (!exists<AddressList>(get_board_obj_address())) {
                let board_obj_signer = get_board_obj_signer();
                move_to(&board_obj_signer, AddressList {
                    addresses: vector::empty(),
                });
            };

            let list = borrow_global_mut<AddressList>(get_board_obj_address());
            vector::push_back(&mut list.addresses, signer::address_of(_sender));
            }
        }
    }

    public entry fun store_entry(
        user: &signer,
        merkle_root: vector<u8>,
        snp_hashes: vector<vector<u8>>,
        date: u64,
    ) acquires Entry {
        if (!exists<Entry>(signer::address_of(user))) {
            move_to(user, Entry {
                merkle_root,
                date,
                snp_hashes,
                called: false,
            });
        } else {
            let entry = borrow_global_mut<Entry>(signer::address_of(user));
            entry.merkle_root = merkle_root;
            entry.snp_hashes = snp_hashes;
            entry.date = date;
        }
    }

    // ======================== Read Functions ========================

    #[view]
    public fun exists_address_list(): bool {
        exists<AddressList>(get_board_obj_address())
    }

    #[view]
    public fun get_addresses(): vector<address> acquires AddressList {
        let list = borrow_global<AddressList>(get_board_obj_address());
        list.addresses
    }

    #[view]
    public fun get_entry(user_addr: address): (vector<u8>, vector<vector<u8>>, u64) acquires Entry {
        let entry = borrow_global<Entry>(user_addr);
        (entry.merkle_root, entry.snp_hashes, entry.date)
    }

    #[view]
    public fun entry_exists(user_addr: address): bool {
        exists<Entry>(user_addr)
    }

    // ======================== Helper Functions ========================

    fun get_board_obj_address(): address {
        object::create_object_address(&@gene_ledger_addr, SEED)
    }

    fun get_board_obj_signer(): signer acquires BoardObjectController {
        object::generate_signer_for_extending(&borrow_global<BoardObjectController>(get_board_obj_address()).extend_ref)
    }

    // ======================== Unit Tests ========================

    #[test_only]
    public fun init_module_for_test(sender: &signer) {
        init_module(sender);
    }
}

