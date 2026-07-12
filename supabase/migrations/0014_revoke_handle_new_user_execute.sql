-- handle_new_user só roda via trigger (que não depende de grants de EXECUTE
-- pra disparar); não há motivo pra deixá-la exposta como /rest/v1/rpc/handle_new_user.
revoke execute on function handle_new_user() from public;
