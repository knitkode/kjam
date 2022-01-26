import { SerializerNext } from "../../serializer-next/src"; // @kjam/serializer-next
import { Git } from "../../action/src"; // @kjam/action

// TODO: pass config from @action.core and use its logger?
const serializer = new SerializerNext();
const git =
  process.env["KJAM_SKIP_GIT"] === "true"
    ? null
    : new Git(serializer.root, serializer.run.bind(serializer));

async function run(): Promise<void> {
  if (git) {
    await git.run();
  } else {
    await serializer.run();
  }
}

run()
  .then(git ? () => git.success() : () => {})
  .catch(git ? (e) => git.error(e) : () => {});