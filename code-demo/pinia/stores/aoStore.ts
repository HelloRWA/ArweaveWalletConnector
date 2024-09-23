import { message, result, dryrun } from "@permaweb/aoconnect";

export const aoStore = defineStore("aoStore", () => {
  const { address, signer: _signer } = $(pwaConnectorStore());

  const read = async ({ action, process, tagsObj = false }) => {
    let tags = [{ name: "Action", value: action }];

    if (address) {
      tags.push({ name: "Address", value: address });
    }

    if (tagsObj) {
      tags = [
        ...tags,
        ...Object.entries(tagsObj).map(([name, value]) => ({ name, value })),
      ];
    }

    const rz = await dryrun({
      process,
      data: "",
      tags,
    });

    if (rz.Messages && rz.Messages[0] && rz.Messages[0].Data) {
      const data = JSON.parse(rz.Messages[0].Data);
      return data;
    }

    return {};
  };

  const write = async ({ action, process, signer, tagsObj = false }) => {
    if (!signer) {
      signer = _signer;
    }
    let tags = [{ name: "Action", value: action }];
    if (tagsObj) {
      tags = [
        ...tags,
        ...Object.entries(tagsObj).map(([name, value]) => ({ name, value })),
      ];
    }

    try {
      const mid = await message({
        process,
        signer,
        data: "",
        tags,
      });
      let rz = await result({
        message: mid,
        process,
      });

      if (rz.Messages && rz.Messages[0] && rz.Messages[0].Data) {
        const data = JSON.parse(rz.Messages[0].Data);
        return data;
      }
    } catch (error) {
      // if(error.message === 'Rejected') {
      //   return {
      //     error: 'Rejected'
      //   }
      // }
      console.error("Error writing to AO:", error);
      throw error;
    }

    return {};
  };

  return $$({ read, write });
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(aoStore, import.meta.hot));
