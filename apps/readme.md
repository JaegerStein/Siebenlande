# apps

Source for the standalone web apps that ship alongside the Quartz site. Each app
lives in its own folder with its own `package.json` and dependency tree, so
nothing here can interfere with the Quartz build at the repo root.

| App                       | Published at          | Purpose                                                                                                       |
| ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| [spellsmith](spellsmith/) | `/static/spellsmith/` | Builder for component magic effects — drag components together, see the effect level and the resolved effect. |

## Publishing

Apps are **not** built by CI. The site build must stay free of app builds, so a
published version is made deliberately:

```bash
cd apps/spellsmith
npm run publish
```

That writes the bundle into `quartz/static/<app>/` and it is committed from
there. Quartz copies `quartz/static/` into its output verbatim on every build, so
the app gets a stable path on the server with no deploy-workflow changes.

Consequence worth knowing: editing an app's source changes nothing on the live
site until someone runs `npm run publish` and commits the rebuilt folder.

Apps are written in English; everything the visitor reads is German.
