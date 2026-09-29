These modules are checked into the frontend repository so it can build when
deployed independently, without a sibling `shared` directory.

They were copied from the workspace-level shared modules. When changing pricing,
page-copy keys, or service defaults, keep these copies consistent with the
backend/admin versions. Do not replace them with imports outside this repository.
