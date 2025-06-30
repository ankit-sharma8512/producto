from pyflink.datastream.connectors.jdbc import JdbcSink, JdbcConnectionOptions, JdbcExecutionOptions
from parsers                            import stock_message_type, lot_message_type

import os

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

stock_sink = JdbcSink.sink(
    '''
        INSERT INTO stock (id, available)
        values (?::uuid, ?)
        ON CONFLICT (id)
        DO UPDATE SET available = EXCLUDED.available;
    ''',
    stock_message_type,
    JdbcConnectionOptions.JdbcConnectionOptionsBuilder()
        .with_url(f'jdbc:postgresql://{DB_HOST}:5432/{DB_NAME}')
        .with_user_name(DB_USER)
        .with_password(DB_PASS)
        .with_driver_name('org.postgresql.Driver')
        .build(),
    JdbcExecutionOptions.builder()
        .with_batch_interval_ms(1000)
        .with_batch_size(1)
        .with_max_retries(10)
        .build()
)

lot_sink = JdbcSink.sink(
    '''
        INSERT INTO lots (productid, purchaseid, date, quantity, mfgdate, expdate, price, type)
        values (?::uuid, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (productid, purchaseid, type)
        DO NOTHING;
    ''',
    lot_message_type,
    JdbcConnectionOptions.JdbcConnectionOptionsBuilder()
        .with_url(f'jdbc:postgresql://{DB_HOST}:5432/{DB_NAME}')
        .with_user_name(DB_USER)
        .with_password(DB_PASS)
        .with_driver_name('org.postgresql.Driver')
        .build(),
    JdbcExecutionOptions.builder()
        .with_batch_interval_ms(1000)
        .with_batch_size(1)
        .with_max_retries(10)
        .build()
)