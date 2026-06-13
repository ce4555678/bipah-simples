CREATE TABLE `clientes_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text,
	`document` text,
	`address` text
);

CREATE VIRTUAL TABLE clientes_fts
USING fts5(
    name,
    content='clientes_table',
    content_rowid='id'
);

CREATE TRIGGER clientes_ai
AFTER INSERT ON clientes_table
BEGIN
    INSERT INTO clientes_fts(
        rowid,
        name
    )
    VALUES (
        NEW.id,
        NEW.name
    );
END;

CREATE TRIGGER clientes_ad
AFTER DELETE ON clientes_table
BEGIN
    INSERT INTO clientes_fts(
        clientes_fts,
        rowid,
        name
    )
    VALUES (
        'delete',
        OLD.id,
        OLD.name
    );
END;

CREATE TRIGGER clientes_au
AFTER UPDATE OF name ON clientes_table
BEGIN
    INSERT INTO clientes_fts(
        clientes_fts,
        rowid,
        name
    )
    VALUES (
        'delete',
        OLD.id,
        OLD.name
    );

    INSERT INTO clientes_fts(
        rowid,
        name
    )
    VALUES (
        NEW.id,
        NEW.name
    );
END;

CREATE TABLE `config_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`terminal` text,
	`cnpj` text,
	`address` text,
	`thermal_printer` text
);

CREATE TABLE `fluxo_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text,
	`valor` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`type` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);

CREATE INDEX `created_at_idx_fluxo` ON `fluxo_table` (`created_at`);
CREATE TABLE `item_venda_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`produto_id` integer NOT NULL,
	`venda_id` integer NOT NULL,
	`amount` real NOT NULL,
	`unit_price` integer NOT NULL,
	`total_price` integer NOT NULL,
	FOREIGN KEY (`produto_id`) REFERENCES `produtos_table`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`venda_id`) REFERENCES `vendas_table`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `produtos_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`description` text NOT NULL,
	`sku` text NOT NULL,
	`image` blob,
	`preco_custo` integer DEFAULT 0 NOT NULL,
	`preco_venda` integer DEFAULT 0 NOT NULL,
	`markup` integer DEFAULT 0,
	`margem_lucro` integer DEFAULT 0,
	`active` integer DEFAULT true
);

CREATE VIRTUAL TABLE produtos_fts
USING fts5(
    description,
    sku,
    tokenize='trigram',
    content='produtos_table',
    content_rowid='id'
);

CREATE TRIGGER produtos_ai
AFTER INSERT ON produtos_table
BEGIN
    INSERT INTO produtos_fts(
        rowid,
        description,
        sku
    )
    VALUES (
        NEW.id,
        NEW.description,
        NEW.sku
    );
END;

CREATE TRIGGER produtos_ad
AFTER DELETE ON produtos_table
BEGIN
    INSERT INTO produtos_fts(
        produtos_fts,
        rowid,
        description,
        sku
    )
    VALUES (
        'delete',
        OLD.id,
        OLD.description,
        OLD.sku
    );
END;

CREATE TRIGGER produtos_au
AFTER UPDATE OF description, sku ON produtos_table
BEGIN
    INSERT INTO produtos_fts(
        produtos_fts,
        rowid,
        description,
        sku
    )
    VALUES (
        'delete',
        OLD.id,
        OLD.description,
        OLD.sku
    );

    INSERT INTO produtos_fts(
        rowid,
        description,
        sku
    )
    VALUES (
        NEW.id,
        NEW.description,
        NEW.sku
    );
END;

CREATE UNIQUE INDEX `produtos_table_sku_unique` ON `produtos_table` (`sku`);
CREATE TABLE `vendas_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`metodo_pagamento` text NOT NULL,
	`desconto` integer,
	`troco` integer,
	`total` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pago' NOT NULL,
	`cliente_id` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`cliente_id`) REFERENCES `clientes_table`(`id`) ON UPDATE no action ON DELETE set null
);

CREATE INDEX `created_at_idx_vendas` ON `vendas_table` (`created_at`);
CREATE INDEX `cliente_id_idx_vendas` ON `vendas_table` (`cliente_id`);

CREATE INDEX item_venda_venda_id_idx
ON item_venda_table(venda_id);

CREATE INDEX item_venda_produto_id_idx
ON item_venda_table(produto_id);

CREATE INDEX produtos_active_idx
ON produtos_table(active);

CREATE INDEX vendas_status_idx
ON vendas_table(status);