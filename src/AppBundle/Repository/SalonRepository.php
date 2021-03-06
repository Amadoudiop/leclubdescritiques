<?php

namespace AppBundle\Repository;

/**
 * SalonRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SalonRepository extends \Doctrine\ORM\EntityRepository
{
	public function findActualRooms()
    {
    	$now = new \DateTime('now');

        $qb = $this->createQueryBuilder("e");
        $qb->where('e.date_start <= :now')
           ->andWhere('e.date_end >= :now')
           ->setParameter('now', $now )
        ;

        $result = $qb->getQuery()->getResult();

        return $result;
    }

    public function findNextRooms()
    {
    	$now = new \DateTime('now');

        $qb = $this->createQueryBuilder("e");
        $qb->where('e.date_start > :now')
           ->setParameter('now', $now )
        ;

        $result = $qb->getQuery()->getResult();

        return $result;
    }
}
