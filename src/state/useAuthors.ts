import { useEffect, useMemo, useState } from 'react';

import ndk from '@/shared/ndk.ts';
import publicState from '@/state/PublicState.ts';
import { useLocalState } from '@/state/useNodeState.ts';
import { PublicKey } from '@/utils/Hex/Hex.ts';

export default function useAuthors(ownerOrGroup?: string, groupPath?: string): string[] {
  const [myPubKey] = useLocalState('user/publicKey', '');
  const initialAuthors = useMemo(() => {
    if (!ownerOrGroup) return [];
    if (ownerOrGroup === 'follows') {
      return myPubKey ? [myPubKey] : [];
    } else {
      const k = new PublicKey(ownerOrGroup);
      return [k.toString()];
    }
  }, [ownerOrGroup]);
  const [authors, setAuthors] = useState<Set<string>>(new Set(initialAuthors));

  useEffect(() => {
    if (ownerOrGroup === 'follows') {
      const user = ndk.getUser({ pubkey: myPubKey });
      user.follows().then((follows) => {
        const newAuthors = new Set([myPubKey]);
        follows.forEach((f) => newAuthors.add(f.pubkey));
        setAuthors(newAuthors);
      });
    }
  }, [ownerOrGroup, myPubKey]);

  useEffect(() => {
    if (!ownerOrGroup || ownerOrGroup === 'follows') return;
    if (groupPath) {
      return publicState([new PublicKey(ownerOrGroup)])
        .get(groupPath)
        .map((value, path) => {
          setAuthors((prev) => {
            const key = path.split('/').pop()!;
            if (!!value === prev.has(key)) return prev; // no state update if value is the same
            const newAuthors = new Set(prev);
            if (value) {
              newAuthors.add(key);
            } else {
              newAuthors.delete(key);
            }
            return newAuthors;
          });
        });
    }
  }, [ownerOrGroup, groupPath]);

  const arr = useMemo(() => Array.from(authors), [authors]);

  return arr;
}
