const create = () => ({
    name: '',
    memberIds: new Set(),
    adminIds: new Set(),

    addMember(memberId) {
        if (this.adminIds.has(memberId)) {
            throw new Error('Cannot add duplicate person');
        }

        this.memberIds.add(memberId);
    },
});

function isMember(newGroup, memberId) {
    return newGroup.memberIds.has(memberId);
}

function canAddMember(newGroup, id) {
    return !isMember(newGroup, id);
}

function addMember(newGroup, memberId) {
    if (newGroup.adminIds.has(memberId)) {
        throw new Error('Cannot add duplicate person');
    }

    return {
        ...newGroup,
        memberIds: [memberId, ...newGroup.memberIds],
    };
}


import { useState } from 'react';
import * as NewGroup from '../domain/newGroup.js'



const [newGroup, setNewGroup] = useState(NewGroup.create())


if (NewGroup.isMember(memberId)) {
    setError('Cannot add duplicate')
} else  {
    setNewGroup(NewGroup.addMember(newGroup, memberId));
}
