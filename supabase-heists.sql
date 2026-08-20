-- Cole isto no SQL Editor do Supabase Dashboard

create table public.heists (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  nome text not null default '',
  nome_real text not null default '',
  nome_disfarce text not null default '',
  local_base text not null default '',
  objetivo text not null default '',
  fase_atual integer not null default 1 check (fase_atual between 1 and 3),
  suspeita integer not null default 0 check (suspeita between 0 and 5),
  relogio integer not null default 0 check (relogio between 0 and 4),
  reforco text not null default '',
  grupo_dominante text not null default '',
  objetivo_obtido boolean not null default false,
  falha_descoberta boolean not null default false,
  falhas_texto text not null default '',
  defesas_texto text not null default '',
  falha_texto text not null default '',
  anotacoes text not null default '',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index heists_player_id_idx on public.heists (player_id);

alter table public.heists enable row level security;

create policy "anon can read heists"
  on public.heists for select
  to anon
  using (true);

create policy "anon can insert heists"
  on public.heists for insert
  to anon
  with check (true);

create policy "anon can update heists"
  on public.heists for update
  to anon
  using (true)
  with check (true);

create policy "anon can delete heists"
  on public.heists for delete
  to anon
  using (true);
